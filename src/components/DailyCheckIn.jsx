import React from 'react';
import { Scale, ChevronRight } from 'lucide-react';

const DailyCheckIn = ({ profile, dailyData, handleStatusChange, handleCheckInSubmit, setDailyData }) => {
    return (
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-slate-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700"><Scale className="w-5 h-5 text-blue-500" /> モーニング・チェックイン</h2>
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">体重 (kg)</label><input type="number" step="0.1" name="weight" value={profile.weight} onChange={handleStatusChange} className="w-full p-3 border border-slate-200 rounded-lg text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">体脂肪率 (%)</label><input type="number" step="0.1" name="bfp" value={profile.bfp} onChange={handleStatusChange} className="w-full p-3 border border-slate-200 rounded-lg text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">昨晩の睡眠 (時間)</label><input type="number" step="0.5" value={dailyData.sleepHours} onChange={(e) => setDailyData({ ...dailyData, sleepHours: parseFloat(e.target.value) })} className="w-full p-3 border border-slate-200 rounded-lg text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2">記録してスタート <ChevronRight className="w-5 h-5" /></button>
            </form>
        </div>
    );
};
export default DailyCheckIn;
