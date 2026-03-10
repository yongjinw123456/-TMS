import React, { useState, useMemo } from 'react';
import { TrackRecord } from '../types';
import { 
  Search, Box, Map as MapIcon, Navigation, AlertTriangle, 
  ChevronLeft, ChevronRight, CheckCircle, Activity, ShieldAlert
} from 'lucide-react';
import { TrackModal } from './TrackModal';

interface TrackMonitoringProps {
  records: TrackRecord[];
}

export const TrackMonitoring: React.FC<TrackMonitoringProps> = ({ records: initialRecords }) => {
  const [records, setRecords] = useState<TrackRecord[]>(initialRecords);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackModal, setTrackModal] = useState<{ isOpen: boolean; record: TrackRecord | null }>({ isOpen: false, record: null });

  // Filters state
  const [filters, setFilters] = useState({
    dispatchNo: '',
    supplier: '',
    vehicleType: '',
    plateNo: '',
    trackStatus: '',
    status: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filters.dispatchNo && !r.dispatchNo.includes(filters.dispatchNo)) return false;
      if (filters.supplier && r.supplier !== filters.supplier) return false;
      if (filters.vehicleType && r.vehicleType !== filters.vehicleType) return false;
      if (filters.plateNo && !r.plateNo.includes(filters.plateNo)) return false;
      if (filters.trackStatus && r.trackStatus !== filters.trackStatus) return false;
      if (filters.status && r.status !== filters.status) return false;
      return true;
    });
  }, [records, filters]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);

  const handleReset = () => {
    setFilters({
      dispatchNo: '',
      supplier: '',
      vehicleType: '',
      plateNo: '',
      trackStatus: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '运输中': return 'text-blue-600 bg-blue-50 border-blue-200';
      case '已结束': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getTrackStatusColor = (status: string) => {
    if (status === '正常' || status === '符合要求') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status.includes('异常') || status === '不符合要求') return 'text-rose-600 bg-rose-50 border-rose-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case '无须处理': return 'text-slate-600 bg-slate-50 border-slate-200';
      case '待处理': return 'text-amber-600 bg-amber-50 border-amber-200';
      case '已处理': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative font-sans">
      {/* Filter Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="text" 
            placeholder="请输入派车单号" 
            className="w-[180px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.dispatchNo}
            onChange={e => setFilters({...filters, dispatchNo: e.target.value})}
          />
          <select 
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.supplier}
            onChange={e => setFilters({...filters, supplier: e.target.value})}
          >
            <option value="">请选择发货方</option>
            <option value="顺丰速运">顺丰速运</option>
            <option value="京东物流">京东物流</option>
            <option value="中通快运">中通快运</option>
          </select>
          <select 
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.vehicleType}
            onChange={e => setFilters({...filters, vehicleType: e.target.value})}
          >
            <option value="">请选择车型</option>
            <option value="4.2m厢式">4.2m厢式</option>
            <option value="9.6m高栏">9.6m高栏</option>
          </select>
          <input 
            type="text" 
            placeholder="请输入车牌号" 
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.plateNo}
            onChange={e => setFilters({...filters, plateNo: e.target.value})}
          />
          <select 
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.trackStatus}
            onChange={e => setFilters({...filters, trackStatus: e.target.value})}
          >
            <option value="">轨迹预警状态</option>
            <option value="正常">正常</option>
            <option value="异常L1">异常L1</option>
            <option value="异常L2">异常L2</option>
            <option value="异常L3">异常L3</option>
            <option value="异常L4">异常L4</option>
          </select>
          <select 
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部运输状态</option>
            <option value="运输中">运输中(发车后,到达前)</option>
            <option value="已结束">已结束(全部签收)</option>
          </select>
          
          <div className="flex-1 flex justify-end gap-2">
            <button onClick={handleReset} className="px-4 py-1.5 bg-[#F2F3F5] text-[#4E5969] rounded hover:bg-slate-200 text-sm transition-all">重置</button>
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 bg-[#1677FF] text-white rounded hover:bg-blue-600 text-sm transition-all">查询</button>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[1800px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#F2F3F5] text-[#1D2129] text-[14px] font-bold h-10">
                <th className="px-4 py-2 w-12 border-b border-slate-200 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                      checked={paginatedRecords.length > 0 && selectedIds.length === paginatedRecords.length}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(paginatedRecords.map(o => o.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </div>
                </th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">派车单号</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发货方</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">车型</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">车牌号</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">司机姓名</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">司机联系方式</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">发车时间 ↕</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">到达时间<span className="text-xs text-slate-400 font-normal block">(到达首个收货点)</span></th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">预估距离</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">轨迹丢失时长 ↕</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">预警等级</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">运输状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">轨迹状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理方式</th>
                <th className="px-5 py-2 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-[#F2F3F5] shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-slate-700">
              {paginatedRecords.map(r => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <tr key={r.id} className={`border-b border-slate-100 h-10 transition-colors duration-200 group ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white hover:bg-[#F5F7FA]'}`}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) setSelectedIds([...selectedIds, r.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== r.id));
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600 whitespace-nowrap">{r.dispatchNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.supplier}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.vehicleType}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{r.plateNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.driverName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.driverContact}</td>
                    <td className="px-4 py-2 font-mono text-slate-500 whitespace-nowrap">{r.departureTime}</td>
                    <td className="px-4 py-2 font-mono text-slate-500 whitespace-nowrap">{r.arrivalTime}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.estimatedDistance}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-rose-500 font-medium">{r.lostDuration}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.warningLevel}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getTrackStatusColor(r.trackStatus)}`}>
                        {r.trackStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getProcessStatusColor(r.processStatus)}`}>
                        {r.processStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.processMethod}</td>
                    <td className={`px-5 py-2 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors text-right ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white group-hover:bg-[#F5F7FA]'}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setTrackModal({ isOpen: true, record: r })} 
                          className="text-[#1677FF] hover:underline text-[14px] font-medium transition-all"
                        >
                          查看轨迹
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedRecords.length === 0 && (
                <tr>
                  <td colSpan={17} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <Box size={32} className="text-slate-300" />
                      </div>
                      <p className="text-[14px] font-medium text-slate-500">暂无数据</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="text-[14px] text-slate-500 font-medium">
            共 {filteredRecords.length} 条记录
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[14px] text-slate-500 font-medium">
              <span>每页显示</span>
              <select 
                className="border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>条</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                className={`p-1 rounded border ${currentPage === 1 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded text-[14px] font-medium flex items-center justify-center transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#1677FF] text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className={`p-1 rounded border ${currentPage === totalPages || totalPages === 0 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <TrackModal 
        isOpen={trackModal.isOpen} 
        onClose={() => setTrackModal({ isOpen: false, record: null })} 
        record={trackModal.record} 
      />
    </div>
  );
};
