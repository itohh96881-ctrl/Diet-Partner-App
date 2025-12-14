import React from 'react';
import { Settings, X } from 'lucide-react';

const SettingsModal = ({ show, onClose, user, syncError, logs, setLogs, tempApiKey, setTempApiKey, handleSaveApiKey }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" /> 設定</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-y-auto space-y-4">
                    <section>
                        <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">API Settings</h4>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Google Gemini APIキー</label>
                        <input type="password" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} className="w-full p-2 border rounded-lg text-sm mb-2" placeholder="AIzaSy..." />
                        <button onClick={handleSaveApiKey} className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg">保存する</button>
                    </section>

                    <section>
                        <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">Connection Diagnostics</h4>
                        <div className="bg-slate-100 p-3 rounded-lg text-xs font-mono">
                            <div className="flex justify-between mb-1"><span>Auth Status:</span> <span className={user ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{user ? "Authenticated" : "Not Authenticated"}</span></div>
                            <div className="flex justify-between mb-1"><span>User ID:</span> <span>{user ? user.uid.substring(0, 8) + "..." : "-"}</span></div>
                            <div className="flex justify-between"><span>Sync Error:</span> <span className={syncError ? "text-red-600 font-bold" : "text-green-600"}>{syncError ? "Yes" : "No"}</span></div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase flex justify-between">Debug Log <button onClick={() => setLogs([])} className="text-blue-500">Clear</button></h4>
                        <div className="bg-black text-green-400 p-2 rounded-lg h-32 overflow-y-auto text-[10px] font-mono log-scroll">
                            {logs.length === 0 && <span className="opacity-50">No logs yet...</span>}
                            {logs.map((log, i) => <div key={i} className="mb-1 border-b border-gray-800 pb-1">{log}</div>)}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
