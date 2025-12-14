import React from 'react';

const SimpleChart = ({ data, dataKey, color, label, unit, domain }) => {
    if (!data || data.length < 2) {
        return <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 text-sm">データ不足</div>;
    }
    const values = data.map(d => d[dataKey]);
    const min = Math.min(...values, domain[0]);
    const max = Math.max(...values, domain[1]);
    const range = max - min || 1;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d[dataKey] - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                <span>{label}推移</span>
                <span>Current: {values[values.length - 1]}{unit}</span>
            </div>
            <div className="h-24 w-full bg-white border border-slate-100 rounded-lg relative overflow-hidden p-2">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - ((d[dataKey] - min) / range) * 100;
                        return <circle key={i} cx={x} cy={y} r="1.5" fill={color} className="opacity-80" />;
                    })}
                </svg>
            </div>
        </div>
    );
};

export default SimpleChart;
