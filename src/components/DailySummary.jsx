import React from 'react';
import { Trophy, CheckCircle, Award, Star, ImageIcon, RefreshCw, Loader2 } from 'lucide-react';

const DailySummary = ({ dailyData, plan, toggleTask, handleFinishDay, finishing, handleDailyReset }) => {
    return (
        <>
            <section className={`bg-white rounded-xl shadow-md p-5 border border-slate-100 transition-opacity ${dailyData.isFinished ? 'opacity-75 pointer-events-none' : ''}`}>
                <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> 完了報告</h3>
                <div className="space-y-3">
                    <button onClick={() => toggleTask('meal')} className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 text-left ${dailyData.tasks.meal ? 'bg-emerald-50 border-emerald-500' : 'bg-white hover:border-emerald-300'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${dailyData.tasks.meal ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>{dailyData.tasks.meal && <CheckCircle className="w-4 h-4 text-white" />}</div><div><span className={`block text-sm ${dailyData.tasks.meal ? 'text-emerald-900 font-bold' : 'text-slate-700 font-medium'}`}>食事ルールを守った</span></div></button>
                    <button onClick={() => toggleTask('workout')} className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 text-left ${dailyData.tasks.workout ? 'bg-blue-50 border-blue-500' : 'bg-white hover:border-blue-300'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${dailyData.tasks.workout ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>{dailyData.tasks.workout && <CheckCircle className="w-4 h-4 text-white" />}</div><div><span className={`block text-sm ${dailyData.tasks.workout ? 'text-blue-900 font-bold' : 'text-slate-700 font-medium'}`}>ノルマ達成: {plan.workout}</span></div></button>
                    <button onClick={() => toggleTask('sleep')} className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 text-left ${dailyData.tasks.sleep ? 'bg-indigo-50 border-indigo-500' : 'bg-white hover:border-indigo-300'}`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${dailyData.tasks.sleep ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>{dailyData.tasks.sleep && <CheckCircle className="w-4 h-4 text-white" />}</div><div><span className={`block text-sm ${dailyData.tasks.sleep ? 'text-indigo-900 font-bold' : 'text-slate-700 font-medium'}`}>就寝準備OK</span></div>
                    </button>
                </div>
            </section>

            {!dailyData.isFinished ? (
                <div className="pt-2 pb-6"><button onClick={handleFinishDay} disabled={finishing} className={`w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${finishing ? 'opacity-70 cursor-wait' : 'hover:bg-slate-700'}`}>{finishing ? <><Loader2 className="w-5 h-5 animate-spin" /> 作成中...</> : <><CheckCircle className="w-5 h-5" /> 1日を終了して報告</>}</button><p className="text-center text-xs text-slate-400 mt-2">※確定するとコメントと応援イラストが届きます</p></div>
            ) : (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-xl p-6 text-white mb-6 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 mb-4"><Award className="w-8 h-8 text-yellow-300" /><div><h3 className="font-bold text-xl">Good Job!</h3><p className="text-xs text-indigo-100 opacity-90">活動記録を保存しました</p></div></div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 relative mb-4"><div className="absolute -top-3 -left-2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">INSTRUCTOR'S COMMENT</div><div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden">👨‍🏫</div><p className="text-sm leading-relaxed font-medium">{dailyData.dailyFeedback}</p></div></div>
                    {dailyData.dailyImage ? (<div className="rounded-lg overflow-hidden border-4 border-white/20 shadow-lg relative"><img src={dailyData.dailyImage} alt="Reward" className="w-full h-auto object-cover" /><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"><p className="text-xs text-white font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> AI Generated Reward (Imagen 4)</p></div></div>) : (<div className="bg-white/5 rounded-lg h-32 flex flex-col items-center justify-center text-white/50 border border-dashed border-white/20"><ImageIcon className="w-8 h-8 mb-1 opacity-50" /><span className="text-xs">No image (保存されません)</span></div>)}
                    <div className="mt-4 flex justify-between items-center text-xs text-indigo-100"><span>明日もこの調子で！</span><div className="flex gap-1">{[1, 2, 3].map(i => <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />)}</div></div>
                </div>
            )}

            <div className="text-center pt-8 pb-4"><button onClick={handleDailyReset} className="text-xs text-slate-300 flex items-center justify-center gap-1 mx-auto hover:text-red-400 transition-colors"><RefreshCw className="w-3 h-3" /> 今日の記録をリセット</button></div>
        </>
    );
};
export default DailySummary;
