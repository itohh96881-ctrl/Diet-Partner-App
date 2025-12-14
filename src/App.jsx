import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity, TrendingDown, Cloud, CloudOff, Loader2, Settings } from 'lucide-react';
import { auth, db, signInAnonymously, onAuthStateChanged, doc, setDoc, onSnapshot, appId } from './lib/firebase';
import { WEEKLY_PLAN_BASE, INITIAL_GOAL } from './data/constants';
import SimpleChart from './components/SimpleChart';
import DailyCheckIn from './components/DailyCheckIn';
import WeeklyPlan from './components/WeeklyPlan';
import MealLogger from './components/MealLogger';
import DailySummary from './components/DailySummary';
import SettingsModal from './components/SettingsModal';

function App() {
  const [user, setUser] = useState(null);
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
    if (type === 'error') console.error(msg);
    else console.log(msg);
  };

  // Data State
  const [profile, setProfile] = useState({ weight: 84.6, bfp: 20.4, apiKey: "" });
  const [history, setHistory] = useState([
    { date: new Date(Date.now() - 86400000 * 2).toISOString(), weight: 85.0, bfp: 20.8 },
    { date: new Date(Date.now() - 86400000).toISOString(), weight: 84.8, bfp: 20.5 },
    { date: new Date().toISOString(), weight: 84.6, bfp: 20.4 }
  ]);
  const [dailyData, setDailyData] = useState({
    date: new Date().toISOString(),
    sleepHours: 6,
    feeling: 'normal',
    isCheckedIn: false,
    tasks: { meal: false, workout: false, sleep: false },
    isFinished: false,
    dailyFeedback: null,
    dailyImage: null
  });
  const [mealLogs, setMealLogs] = useState({
    breakfast: { image: null, result: null, skipped: false },
    lunch: { image: null, result: null, skipped: false },
    dinner: { image: null, result: null, skipped: false }
  });
  const [aiPlan, setAiPlan] = useState(null);

  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [analyzing, setAnalyzing] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const fileInputRef = useRef(null);

  const todayDocId = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, [today]);

  const plan = useMemo(() => {
    if (aiPlan) return aiPlan;
    return WEEKLY_PLAN_BASE[today.getDay()];
  }, [today, aiPlan]);

  // Auth & Init
  useEffect(() => {
    let attempts = 0;
    const tryInitAuth = async () => {
      if (!auth) {
        if (attempts < 10) {
          attempts++;
          setTimeout(tryInitAuth, 500);
          return;
        }
        addLog("Firebase Auth module not initialized.", 'error');
        setSyncError(true);
        setLoading(false);
        return;
      }

      try {
        addLog("Authenticating...");
        await signInAnonymously(auth);
        addLog("Signed in anonymously.");
      } catch (error) {
        addLog(`Auth Failed: ${error.message}`, 'error');
        setSyncError(true);
        setLoading(false);
      }
    };
    tryInitAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        addLog(`User: ${currentUser.uid}`);
      } else {
        addLog("User logged out or null.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync
  useEffect(() => {
    if (!user || !db) return;

    addLog(`Syncing data for user: ${user.uid}`);
    const userDocRef = (col) => doc(db, 'artifacts', appId, 'users', user.uid, 'diet_data', col);

    const unsubProfile = onSnapshot(userDocRef('profile'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (err) => {
      addLog(`Profile Sync Error: ${err.message}`, 'error');
      setSyncError(true);
    });

    const unsubHistory = onSnapshot(userDocRef('history'), (docSnap) => {
      if (docSnap.exists()) {
        setHistory(docSnap.data().records || []);
      }
    });

    const unsubDaily = onSnapshot(userDocRef(todayDocId), (docSnap) => {
      setLoading(false);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDailyData(prev => ({ ...prev, ...data.checkIn }));
        if (data.mealLogs) {
          setMealLogs(prev => {
            const newLogs = {};
            Object.keys(data.mealLogs).forEach(key => {
              newLogs[key] = { ...data.mealLogs[key], image: prev[key]?.image || null };
            });
            return newLogs;
          });
        }
        if (data.aiPlan) setAiPlan(data.aiPlan);
      }
    }, (err) => {
      addLog(`Daily Data Sync Error: ${err.message}`, 'error');
      setLoading(false);
    });

    return () => { unsubProfile(); unsubHistory(); unsubDaily(); };
  }, [user, todayDocId]);

  const saveToFirestore = async (col, data) => {
    if (!user || !db) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'diet_data', col);
      await setDoc(docRef, data, { merge: true });
    } catch (e) {
      addLog(`Save Error (${col}): ${e.message}`, 'error');
      setSyncError(true);
    }
  };

  const saveDailyData = (newCheckIn, newMealLogs, newAiPlan) => {
    const cleanCheckIn = { ...newCheckIn, dailyImage: null }; // Don't save image to Firestore
    const cleanMealLogs = {};
    Object.keys(newMealLogs || mealLogs).forEach(key => {
      const log = newMealLogs?.[key] || mealLogs[key];
      cleanMealLogs[key] = { ...log, image: null };
    });
    saveToFirestore(todayDocId, {
      checkIn: cleanCheckIn,
      mealLogs: cleanMealLogs,
      aiPlan: newAiPlan || aiPlan,
      updatedAt: new Date().toISOString()
    });
  };

  const saveProfile = (newProfile) => saveToFirestore('profile', newProfile);
  const saveHistory = (newHistory) => saveToFirestore('history', { records: newHistory });

  const handleSaveApiKey = () => {
    const newProfile = { ...profile, apiKey: tempApiKey };
    setProfile(newProfile);
    saveProfile(newProfile);
    alert("APIキーを保存しました（クラウド同期）");
  };

  const openSettings = () => {
    setTempApiKey(profile.apiKey || "");
    setShowSettings(true);
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const generateDailyPlan = async (status, sleep) => {
    if (!profile.apiKey) return;
    setIsPlanLoading(true);
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][today.getDay()];
    const recentHistory = history.slice(-3).map(h => `- ${new Date(h.date).toLocaleDateString()}: ${h.weight}kg`).join('\n');
    const prompt = `ダイエットインストラクターとして、今日の最適プランをJSONで作成。目標65kg/15%。現在${status.weight}kg。${dayOfWeek}, 睡眠${sleep}h。履歴:${recentHistory}。睡眠不足時は休息優先。JSON:{ "day": "${dayOfWeek}", "title": "テーマ", "type": "rest/home/gym/cardio/adjustment", "targetCalories": 1800, "workout": "指示", "workoutDetail": "詳細", "sleepAdvice": "睡眠", "dietDetail": {"breakfast":"", "lunch":"", "dinner":"", "focus":""}, "color": "bg-indigo-100 border-indigo-500 text-indigo-800" }`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${profile.apiKey}`;
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
      const data = await res.json();
      if (data.candidates) {
        const plan = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim());
        setAiPlan(plan);
        saveDailyData(dailyData, mealLogs, plan);
      }
    } catch (e) {
      addLog(`Plan Gen Error: ${e.message}`, 'error');
    }
    setIsPlanLoading(false);
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    const newEntry = { date: new Date().toISOString(), weight: profile.weight, bfp: profile.bfp };
    const newHistory = [...history];
    const todayStr = new Date().toDateString();
    const existingIndex = newHistory.findIndex(h => new Date(h.date).toDateString() === todayStr);
    if (existingIndex >= 0) newHistory[existingIndex] = newEntry; else newHistory.push(newEntry);

    setHistory(newHistory);
    saveHistory(newHistory);
    saveProfile(profile);

    const newCheckIn = { ...dailyData, isCheckedIn: true, date: new Date().toISOString(), isFinished: false, dailyFeedback: null, dailyImage: null };
    setDailyData(newCheckIn);
    saveDailyData(newCheckIn, mealLogs, aiPlan);

    if (profile.apiKey) await generateDailyPlan(profile, dailyData.sleepHours);
  };

  const toggleTask = (taskName) => {
    if (dailyData.isFinished) return;
    const newTasks = { ...dailyData.tasks, [taskName]: !dailyData.tasks[taskName] };
    const newCheckIn = { ...dailyData, tasks: newTasks };
    setDailyData(newCheckIn);
    saveDailyData(newCheckIn, mealLogs, aiPlan);
  };

  const handleImageUpload = (event) => {
    if (dailyData.isFinished) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMealLogs(prev => ({ ...prev, [activeMeal]: { ...prev[activeMeal], image: reader.result } }));
        analyzeImage(reader.result, activeMeal);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const analyzeImage = async (base64Image, mealType) => {
    if (!profile.apiKey) { alert("APIキーが必要です"); openSettings(); return; }
    setAnalyzing(true);

    const mimeType = base64Image.match(/data:([^;]+);/)?.[1] || "image/jpeg";
    const base64Data = base64Image.split(',')[1];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${profile.apiKey}`;

    const promptText = `
        この料理画像を分析し、以下の情報をJSON形式のみで出力してください。
        Markdownのコードブロックは不要です。数値は半角数字のみ。
        
        {
          "name": "料理名（短く）",
          "calories": 0,
          "protein": 0,
          "fat": 0,
          "carbs": 0,
          "advice": "100文字以内の栄養アドバイス"
        }
        `;

    const payload = {
      contents: [{
        parts: [
          { text: promptText },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }],
      generationConfig: { responseMimeType: "application/json" }
    };

    try {
      addLog(`Analyzing image (${mimeType})...`);
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      if (data.candidates && data.candidates[0].content) {
        const rawText = data.candidates[0].content.parts[0].text;
        addLog(`AI Response: ${rawText.substring(0, 50)}...`);

        const result = JSON.parse(rawText);
        const newMealLogs = { ...mealLogs, [mealType]: { image: base64Image, result: result, skipped: false } };
        setMealLogs(newMealLogs);
        saveDailyData(dailyData, newMealLogs, aiPlan);
      }
    } catch (e) {
      addLog(`Analyze Error: ${e.message}`, 'error');
      alert(`解析エラー: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSkipMeal = (type) => {
    if (window.confirm('欠食にしますか？')) {
      const newLogs = { ...mealLogs, [type]: { image: null, result: null, skipped: true } };
      setMealLogs(newLogs);
      saveDailyData(dailyData, newLogs, aiPlan);
    }
  };

  const handleUndoSkip = (type) => { // Added helper
    handleResetMeal(type);
  }

  const handleResetMeal = (type) => {
    const newLogs = { ...mealLogs, [type]: { image: null, result: null, skipped: false } };
    setMealLogs(newLogs);
    saveDailyData(dailyData, newLogs, aiPlan);
  };

  const totalCalories = useMemo(() => Object.values(mealLogs).reduce((sum, meal) => sum + (meal.result?.calories || 0), 0), [mealLogs]);
  const caloriesProgress = useMemo(() => Math.min(100, (totalCalories / plan.targetCalories) * 100), [totalCalories, plan]);

  const handleFinishDay = async () => {
    if (!window.confirm("1日の記録を確定しますか？")) return;
    if (!profile.apiKey) { alert("APIキーがないため記録のみ保存します。"); saveDailyData({ ...dailyData, isFinished: true, dailyFeedback: "記録完了" }, mealLogs, aiPlan); return; }

    setFinishing(true);
    const textPrompt = `ダイエットコーチとしてフィードバック(100文字)。目標65kg, 現在${profile.weight}kg, 摂取${totalCalories}/${plan.targetCalories}kcal, 達成:食${dailyData.tasks.meal ? 1 : 0}/運${dailyData.tasks.workout ? 1 : 0}/睡${dailyData.tasks.sleep ? 1 : 0}`;
    const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${profile.apiKey}`;
    const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${profile.apiKey}`;

    let feedback = "お疲れ様！";
    let image = null;
    let errorMessage = "";

    try {
      const tRes = await fetch(textUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: textPrompt }] }] }) });
      const tData = await tRes.json();
      if (tData.candidates) feedback = tData.candidates[0].content.parts[0].text;

      const feeling = dailyData.tasks.workout ? "energetic" : "relaxing";
      const iRes = await fetch(imageUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instances: [{ prompt: `Anime style fitness motivation poster, Theme: ${feeling}, fit person thumbs up` }], parameters: { sampleCount: 1 } }) });
      const iData = await iRes.json();
      if (iData.error) errorMessage = `画像生成エラー: ${iData.error.message}`;
      else if (iData.predictions?.[0]?.bytesBase64Encoded) image = `data:image/png;base64,${iData.predictions[0].bytesBase64Encoded}`;
      else errorMessage = "画像生成失敗";
    } catch (e) {
      addLog(`Finish Day Error: ${e.message}`, 'error');
      errorMessage = "通信エラー";
    }

    if (errorMessage) feedback += `\n(※${errorMessage})`;

    const newCheckIn = { ...dailyData, isFinished: true, dailyFeedback: feedback, dailyImage: image };
    setDailyData(newCheckIn);
    saveDailyData(newCheckIn, mealLogs, aiPlan);
    setFinishing(false);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  const handleDailyReset = () => {
    if (window.confirm('今日の記録をリセットしますか？')) {
      const resetCheckIn = { date: new Date().toISOString(), sleepHours: 6, feeling: 'normal', isCheckedIn: false, tasks: { meal: false, workout: false, sleep: false }, isFinished: false, dailyFeedback: null, dailyImage: null };
      const resetLogs = { breakfast: { image: null, result: null, skipped: false }, lunch: { image: null, result: null, skipped: false }, dinner: { image: null, result: null, skipped: false } };
      setDailyData(resetCheckIn);
      setMealLogs(resetLogs);
      setAiPlan(null);
      saveDailyData(resetCheckIn, resetLogs, null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <header className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div><h1 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /> Diet Partner {syncError ? <CloudOff className="w-4 h-4 text-red-400" /> : <Cloud className="w-4 h-4 text-emerald-400" />}</h1><p className="text-slate-400 text-xs mt-1">Goal: 65kg / 15%</p></div>
          <div className="flex items-center gap-3"><div className="text-right"><p className="text-xs text-slate-400">{today.toLocaleDateString()}</p><p className="font-bold text-lg">{plan.day}</p></div><button onClick={openSettings} className="bg-white/10 hover:bg-white/20 p-2 rounded-full"><Settings className="w-5 h-5 text-slate-200" /></button></div>
        </div>
        {dailyData.isCheckedIn && (
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="bg-slate-800/50 p-3 rounded-lg w-[48%] backdrop-blur-sm"><p className="text-xs text-slate-400">体重</p><div className="flex items-baseline gap-1"><span className="text-2xl font-bold">{profile.weight}</span><span className="text-xs">kg</span></div><p className="text-xs text-emerald-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />あと {(profile.weight - INITIAL_GOAL.weight).toFixed(1)}kg</p></div>
              <div className="bg-slate-800/50 p-3 rounded-lg w-[48%] backdrop-blur-sm"><p className="text-xs text-slate-400">体脂肪率</p><div className="flex items-baseline gap-1"><span className="text-2xl font-bold">{profile.bfp}</span><span className="text-xs">%</span></div><p className="text-xs text-emerald-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />あと {(profile.bfp - INITIAL_GOAL.bfp).toFixed(1)}%</p></div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10"><SimpleChart data={history.slice(-14)} dataKey="weight" color="#34d399" label="Weight" unit="kg" domain={[INITIAL_GOAL.weight, INITIAL_GOAL.startWeight]} /></div>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 -mt-4 relative z-20">
        {!dailyData.isCheckedIn ? (
          <DailyCheckIn
            profile={profile}
            dailyData={dailyData}
            handleStatusChange={handleStatusChange}
            handleCheckInSubmit={handleCheckInSubmit}
            setDailyData={setDailyData}
          />
        ) : (
          <div className="space-y-6 pt-4">
            {dailyData.sleepHours < 6.5 && <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start gap-3"><Loader2 className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" /><div><h3 className="font-bold text-amber-800 text-sm">睡眠不足アラート</h3><p className="text-xs text-amber-700 mt-1">睡眠{dailyData.sleepHours}時間。カフェインは14時まで、仮眠推奨。</p></div></div>}

            <WeeklyPlan plan={plan} isPlanLoading={isPlanLoading} aiPlan={aiPlan} />

            <MealLogger
              dailyData={dailyData}
              plan={plan}
              totalCalories={totalCalories}
              caloriesProgress={caloriesProgress}
              activeMeal={activeMeal}
              setActiveMeal={setActiveMeal}
              mealLogs={mealLogs}
              handleImageUpload={handleImageUpload}
              fileInputRef={fileInputRef}
              analyzing={analyzing}
              handleResetMeal={handleResetMeal}
              handleSkipMeal={handleSkipMeal}
              handleUndoSkip={handleUndoSkip}
            />

            <DailySummary
              dailyData={dailyData}
              plan={plan}
              toggleTask={toggleTask}
              handleFinishDay={handleFinishDay}
              finishing={finishing}
              handleDailyReset={handleDailyReset}
            />
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur border-t border-slate-200 p-3 text-center text-[10px] text-slate-400 z-50">Professional Diet Instructor System v3.3 (Vite + React)</footer>

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        syncError={syncError}
        logs={logs}
        setLogs={setLogs}
        tempApiKey={tempApiKey}
        setTempApiKey={setTempApiKey}
        handleSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
