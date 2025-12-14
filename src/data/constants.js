export const WEEKLY_PLAN_BASE = {
    0: { day: '日曜日', type: 'adjustment', title: '調整日 & チートミール', targetCalories: 1600, workout: '完全休養 または 軽い散歩', workoutDetail: '今日は心と体を休める日です。', sleepAdvice: '明日の仕事に備え早めに就寝。', dietDetail: { breakfast: '軽め', lunch: 'チートミールOK', dinner: '調整食', focus: '1食は自由に' }, color: 'bg-green-100 border-green-500 text-green-800' },
    1: { day: '月曜日', type: 'home', title: '自宅トレ(軽) & 仕事モード', targetCalories: 1750, workout: 'スクワット・ストレッチ', workoutDetail: 'ポモドーロ・スクワット：50分仕事→10回スクワット', sleepAdvice: '23時までには就寝。', dietDetail: { breakfast: '和食推奨', lunch: '定食スタイル', dinner: '主菜＋サラダ', focus: '週末のリセット' }, color: 'bg-blue-100 border-blue-500 text-blue-800' },
    2: { day: '火曜日', type: 'gym', title: 'ジム (筋トレA: 脚・胸)', targetCalories: 1950, workout: '下半身・胸メイン＋有酸素', workoutDetail: 'レッグプレス、チェストプレス各10回×3', sleepAdvice: 'マグネシウムを摂取してリラックス。', dietDetail: { breakfast: 'オートミール等', lunch: 'トレ前におにぎり', dinner: '赤身肉でリカバリー', focus: 'トレ前後の栄養補給' }, color: 'bg-red-100 border-red-500 text-red-800' },
    3: { day: '水曜日', type: 'rest', title: '完全休養日', targetCalories: 1600, workout: 'オフ（睡眠優先）', workoutDetail: 'トレーニング禁止。ストレッチのみOK。', sleepAdvice: '目標7.5時間睡眠。', dietDetail: { breakfast: 'スムージー等', lunch: '蕎麦やうどん', dinner: '鍋物やポトフ', focus: '内臓を休める' }, color: 'bg-indigo-100 border-indigo-500 text-indigo-800' },
    4: { day: '木曜日', type: 'home', title: '自宅トレ(軽)', targetCalories: 1750, workout: '散歩 または ストレッチ', workoutDetail: '朝イチまたは夕方に20分の早歩き', sleepAdvice: 'アロマなどでリラックス。', dietDetail: { breakfast: '卵とブロッコリー', lunch: 'コンビニならサラダチキン', dinner: '白身魚', focus: '間食に注意' }, color: 'bg-blue-100 border-blue-500 text-blue-800' },
    5: { day: '金曜日', type: 'gym', title: 'ジム (筋トレB: 背中・腹)', targetCalories: 1950, workout: '背中・腹筋メイン＋有酸素', workoutDetail: 'ラットプルダウン、クランチ', sleepAdvice: '夜更かし注意。', dietDetail: { breakfast: 'しっかり食べる', lunch: 'パスタ等は避ける', dinner: '居酒屋メニュー風（ヘルシーに）', focus: 'お酒は蒸留酒' }, color: 'bg-red-100 border-red-500 text-red-800' },
    6: { day: '土曜日', type: 'cardio', title: '有酸素強化 (ラン/HIIT)', targetCalories: 1850, workout: 'ランニング または HIIT', workoutDetail: '脂肪燃焼デー。ラン30分 or HIIT 4分', sleepAdvice: '運動の疲れで深く眠る。', dietDetail: { breakfast: 'バナナ＋プロテイン', lunch: '炭水化物OK', dinner: 'きのこ・海藻', focus: '水分をたっぷり' }, color: 'bg-orange-100 border-orange-500 text-orange-800' }
};

export const INITIAL_GOAL = { weight: 65.0, bfp: 15.0, startWeight: 84.6, startBfp: 20.4 };

export const AI_CONFIG = {
    // Gemini 2.5 Flash: As requested by user.
    TEXT_MODEL: "gemini-2.5-flash",

    // Imagen 3: Latest high-quality image generation model.
    IMAGE_MODEL: "imagen-3.0-generate-001",

    BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models"
};
