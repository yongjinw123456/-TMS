import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { 
  Search, Box, Truck, AlertCircle, CheckCircle, 
  Trash2, Info, X, ChevronDown, Settings, MapPin, Calendar, Layers, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface AppointmentManagementProps {
  appointments: Appointment[];
}

export const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ appointments: initialAppointments }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Custom Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Local Toast State
  const [localToast, setLocalToast] = useState('');

  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(''), 3000);
  };

  // Filters state
  const [filters, setFilters] = useState({
    orderNo: '',
    status: '',
    receiverName: '',
    receiverContact: '',
    senderName: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      if (filters.orderNo && !a.orderNo.includes(filters.orderNo)) return false;
      if (filters.status && a.status !== filters.status) return false;
      if (filters.receiverName && !a.receiverName.includes(filters.receiverName)) return false;
      if (filters.receiverContact && !a.receiverContact.includes(filters.receiverContact)) return false;
      if (filters.senderName && a.senderName !== filters.senderName) return false;
      return true;
    });
  }, [appointments, filters]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAppointments.length / pageSize);

  const handleReset = () => {
    setFilters({
      orderNo: '',
      status: '',
      receiverName: '',
      receiverContact: '',
      senderName: ''
    });
    setCurrentPage(1);
  };

  const handleCancel = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '取消预约',
      message: '确认取消该收货预约？取消后不可恢复',
      onConfirm: () => {
        setAppointments(appointments.map(a => 
          a.id === id ? { ...a, status: '已取消', operateTime: new Date().toLocaleString('zh-CN', { hour12: false }) } : a
        ));
        showToast('预约已取消');
      }
    });
  };

  const handlePush = (id: string) => {
    setAppointments(appointments.map(a => 
      a.id === id ? { ...a, status: '审核中', operateTime: new Date().toLocaleString('zh-CN', { hour12: false }) } : a
    ));
    showToast('已推送至发货方系统审核');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '预约待处理': return 'text-[#FAAD14] bg-[#FAAD14]/10 border-[#FAAD14]/20';
      case '审核中': return 'text-[#FAAD14] bg-[#FAAD14]/10 border-[#FAAD14]/20';
      case '预约成功': return 'text-[#52C41A] bg-[#52C41A]/10 border-[#52C41A]/20';
      case '预约失败': return 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/20';
      case '已取消': return 'text-[#909399] bg-[#909399]/10 border-[#909399]/20';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case '预约待处理': return 'bg-[#FAAD14]';
      case '审核中': return 'bg-[#FAAD14]';
      case '预约成功': return 'bg-[#52C41A]';
      case '预约失败': return 'bg-[#FF4D4F]';
      case '已取消': return 'bg-[#909399]';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative font-sans">
      {/* Premium Toast Notification */}
      {localToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-8 fade-in duration-300 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={14} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium tracking-wide">{localToast}</span>
        </div>
      )}

      {/* Filter Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <input 
            type="text" 
            placeholder="请输入订单号" 
            className="w-[200px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all placeholder:text-[#909399]"
            value={filters.orderNo}
            onChange={e => setFilters({...filters, orderNo: e.target.value})}
          />
          <select 
            className="w-[160px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all text-[#1D2129]"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部</option>
            <option value="预约待处理">预约待处理</option>
            <option value="预约成功">预约成功</option>
            <option value="预约失败">预约失败</option>
            <option value="已取消">已取消</option>
          </select>
          <input 
            type="text" 
            placeholder="请输入收货人名称" 
            className="w-[200px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all placeholder:text-[#909399]"
            value={filters.receiverName}
            onChange={e => setFilters({...filters, receiverName: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="请输入收货人联系方式" 
            className="w-[180px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all placeholder:text-[#909399]"
            value={filters.receiverContact}
            onChange={e => setFilters({...filters, receiverContact: e.target.value})}
          />
          <select 
            className="w-[200px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all text-[#1D2129]"
            value={filters.senderName}
            onChange={e => setFilters({...filters, senderName: e.target.value})}
          >
            <option value="">全部发货方</option>
            <option value="百事可乐">百事可乐</option>
            <option value="农夫山泉">农夫山泉</option>
            <option value="顶津">顶津</option>
          </select>
          <div className="flex-1 flex justify-end gap-2">
            <button onClick={handleReset} className="px-4 py-1.5 bg-[#F2F3F5] text-[#4E5969] rounded hover:bg-[#E5E6EB] text-sm transition-colors">重置</button>
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 bg-[#1677FF] text-white rounded hover:bg-[#4096FF] text-sm transition-colors">查询</button>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#F2F3F5] text-[#1D2129] text-sm font-bold h-10">
                <th className="px-4 py-2 w-12 border-b border-slate-200 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-[#1677FF]/30 transition-all cursor-pointer"
                      checked={paginatedAppointments.length > 0 && selectedIds.length === paginatedAppointments.length}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(paginatedAppointments.map(a => a.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </div>
                </th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">订单号</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发货人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发货人联系方式</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">收货人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">收货人联系方式</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">预计到货时间</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">车型</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">具体收货地址</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发起人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发起时间</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">操作时间</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-[#F2F3F5] shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#4E5969]">
              {paginatedAppointments.map(a => {
                const isSelected = selectedIds.includes(a.id);
                return (
                  <tr key={a.id} className={`border-b border-slate-100 h-10 transition-colors duration-200 group ${isSelected ? 'bg-[#E6F7FF]' : 'hover:bg-[#F5F7FA]'}`}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-[#1677FF]/30 transition-all cursor-pointer"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) setSelectedIds([...selectedIds, a.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== a.id));
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-[#1D2129] whitespace-nowrap">{a.orderNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.senderName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.senderContact}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.receiverName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.receiverContact}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.expectedArrivalTime}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.vehicleType}</td>
                    <td className="px-4 py-2 whitespace-nowrap truncate max-w-[150px]" title={a.receiverAddress}>{a.receiverAddress}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStatusColor(a.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(a.status)}`}></div>
                        {a.status}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.initiator}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.initiateTime}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.operateTime}</td>
                    <td className={`px-4 py-2 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white group-hover:bg-[#F5F7FA]'}`}>
                      <div className="flex items-center gap-2">
                        <button className="text-[#1677FF] hover:text-[#4096FF] text-sm transition-colors">查看详情</button>
                        {a.status === '预约待处理' && (
                          <>
                            <button 
                              className="text-[#FF4D4F] hover:text-red-400 text-sm transition-colors"
                              onClick={() => handleCancel(a.id)}
                            >
                              取消预约
                            </button>
                            <button 
                              className="text-[#1677FF] hover:text-[#4096FF] text-sm transition-colors"
                              onClick={() => handlePush(a.id)}
                            >
                              推送发货方审核
                            </button>
                          </>
                        )}
                        {a.status === '预约失败' && (
                          <button 
                            className="text-[#1677FF] hover:text-[#4096FF] text-sm transition-colors"
                          >
                            重新发起
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedAppointments.length === 0 && (
                <tr>
                  <td colSpan={14} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#909399]">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <Box size={32} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium">暂无数据</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="text-sm text-[#4E5969]">
            共 {filteredAppointments.length} 条记录
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#4E5969]">
              <span>每页显示</span>
              <select 
                className="border border-[#DCDFE6] rounded px-2 py-1 focus:outline-none focus:border-[#1677FF]"
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
                className={`p-1 rounded border ${currentPage === 1 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-[#DCDFE6] text-[#4E5969] hover:border-[#1677FF] hover:text-[#1677FF]'}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded text-sm flex items-center justify-center transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#1677FF] text-white' 
                        : 'text-[#4E5969] hover:bg-[#F2F3F5]'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className={`p-1 rounded border ${currentPage === totalPages || totalPages === 0 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-[#DCDFE6] text-[#4E5969] hover:border-[#1677FF] hover:text-[#1677FF]'}`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF2F0] flex items-center justify-center text-[#FF4D4F] shrink-0 border border-red-100">
                  <AlertCircle size={24} />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-[#1D2129] mb-2 tracking-tight">{confirmDialog.title}</h3>
                  <p className="text-sm text-[#4E5969] leading-relaxed">{confirmDialog.message}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setConfirmDialog(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#4E5969] text-sm font-medium hover:bg-white hover:text-[#1D2129] transition-colors shadow-sm">取消</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="px-5 py-2.5 rounded-xl bg-[#FF4D4F] text-white text-sm font-medium hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors">确认继续</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
