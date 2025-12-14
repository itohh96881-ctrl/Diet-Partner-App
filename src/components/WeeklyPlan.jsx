import React from 'react';
import { Calendar, Loader2, Activity, Utensils, Flame, Sparkles } from 'lucide-react';

const WeeklyPlan = ({ plan, isPlanLoading, aiPlan }) => {
    return (
        <section className={`rounded-xl shadow-lg border-2 overflow-hidden ${plan.color.replace('text-', 'border-').replace('bg-', 'bg-white ')}`}>
            <div className={`p-4 ${plan.color} flex justify-between items-center`}><h2 className="font-bold text-lg flex items-center gap-2"><Calendar className="w-5 h-5" /> {isPlanLoading ? "最適化中..." : "今日のミッション"}</h2><span className="text-xs font-bold px-2 py-1 bg-white/60 rounded text-slate-800 uppercase tracking-wider">{plan.type}</span></div>
            <div className="p-5 bg-white relative">
                {isPlanLoading && <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center text-slate-500"><Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" /><p className="text-sm font-bold animate-pulse">AIがプラン生成中...</p></div>}
                <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">{plan.title} {aiPlan && <Sparkles className="w-5 h-5 text-yellow-500" />}</h3>
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-blue-500" /><p className="text-sm font-bold text-slate-700">運動指示</p></div><p className="text-slate-700 font-bold mb-1">{plan.workout}</p><p className="text-xs text-slate-500 border-t border-slate-200 pt-2 mt-2">{plan.workoutDetail}</p></div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Utensils className="w-4 h-4 text-emerald-500" /><p className="text-sm font-bold text-slate-700">食事ガイド</p></div><div className="flex items-center gap-1 text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 text-emerald-600"><Flame className="w-3 h-3 fill-emerald-600" /> 目標: {plan.targetCalories} kcal</div></div>
                        <ul className="text-xs text-slate-600 space-y-2 mb-3"><li><span className="font-bold text-emerald-600">朝:</span> {plan.dietDetail.breakfast}</li><li><span className="font-bold text-emerald-600">昼:</span> {plan.dietDetail.lunch}</li><li><span className="font-bold text-emerald-600">夜:</span> {plan.dietDetail.dinner}</li></ul>
                        <div className="bg-emerald-50 p-2 rounded text-xs text-emerald-800 font-bold border border-emerald-100">POINT: {plan.dietDetail.focus}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default WeeklyPlan;
