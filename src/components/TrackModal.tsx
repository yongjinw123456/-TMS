import React from 'react';
import { X, Map as MapIcon, Navigation, AlertTriangle } from 'lucide-react';

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
}

export const TrackModal: React.FC<TrackModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] h-[700px] flex flex-col overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <MapIcon size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">轨迹详情 - {record.dispatchNo}</h3>
              <p className="text-xs text-slate-500 mt-0.5">车牌号: {record.plateNo} | 司机: {record.driverName} ({record.driverContact})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col p-6 bg-slate-50/50 gap-4">
          {/* Info Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">运输状态</div>
              <div className="font-medium text-slate-900">{record.status}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">轨迹状态</div>
              <div className={`font-medium ${record.trackStatus.includes('异常') ? 'text-rose-600' : 'text-emerald-600'}`}>
                {record.trackStatus}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">已获取定位点</div>
              <div className="font-medium text-blue-600">{Math.floor(Math.random() * 100) + 20} 个</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">轨迹丢失时长</div>
              <div className="font-medium text-slate-900">{record.lostDuration || '-'}</div>
            </div>
          </div>

          {/* Map Area Mock */}
          <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Mock Route Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
              <path 
                d="M 100 500 Q 300 400 400 300 T 700 150" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                strokeDasharray="8 8"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>

            {/* Mock Points */}
            <div className="absolute left-[100px] top-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md z-10"></div>
              <div className="mt-1 bg-white px-2 py-0.5 rounded text-[10px] font-medium shadow-sm border border-slate-200">起点</div>
            </div>
            
            <div className="absolute left-[400px] top-[300px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-500 shadow-lg z-20 flex items-center justify-center animate-bounce">
                <Navigation size={14} className="text-blue-600" />
              </div>
              <div className="mt-1 bg-white px-2 py-0.5 rounded text-[10px] font-medium shadow-sm border border-slate-200">当前位置</div>
            </div>

            {record.trackStatus.includes('异常') && (
              <div className="absolute left-[250px] top-[420px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-rose-100 border-2 border-rose-500 shadow-md z-10 flex items-center justify-center">
                  <AlertTriangle size={10} className="text-rose-600" />
                </div>
                <div className="mt-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-medium shadow-sm border border-rose-200">信号丢失</div>
              </div>
            )}

            <div className="absolute left-[700px] top-[150px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-md z-10"></div>
              <div className="mt-1 bg-white px-2 py-0.5 rounded text-[10px] font-medium shadow-sm border border-slate-200">终点</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
