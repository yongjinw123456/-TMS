import React, { useState, useMemo } from 'react';
import { ExceptionEvent } from '../types';
import { 
  Search, Box, ChevronLeft, ChevronRight, X, CheckCircle, 
  Paperclip, ChevronDown, ChevronUp
} from 'lucide-react';

interface ExceptionEventManagementProps {
  events: ExceptionEvent[];
}

type Role = 'carrier' | 'upstream' | 'driver';

export const ExceptionEventManagement: React.FC<ExceptionEventManagementProps> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState<ExceptionEvent[]>(initialEvents);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [role, setRole] = useState<Role>('carrier'); // For demonstration
  
  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [auditModal, setAuditModal] = useState<{ isOpen: boolean; event: ExceptionEvent | null }>({ isOpen: false, event: null });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; event: ExceptionEvent | null }>({ isOpen: false, event: null });
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  // Filters
  const [filters, setFilters] = useState({
    eventType: '',
    status: '',
    eventNo: '',
    dispatchNo: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sort
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredEvents = useMemo(() => {
    let result = events.filter(e => {
      if (filters.eventType && filters.eventType !== '全部' && e.eventType !== filters.eventType) return false;
      if (filters.status && filters.status !== '全部' && e.status !== filters.status) return false;
      if (filters.eventNo && !e.eventNo.includes(filters.eventNo)) return false;
      if (filters.dispatchNo && !e.dispatchNo.includes(filters.dispatchNo)) return false;
      return true;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof ExceptionEvent];
        const bVal = b[sortConfig.key as keyof ExceptionEvent];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [events, filters, sortConfig]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  const handleReset = () => {
    setFilters({ eventType: '', status: '', eventNo: '', dispatchNo: '' });
    setCurrentPage(1);
    setSortConfig(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待调度审核':
      case '待财务审核':
      case '待上游审核':
      case '待司机确认':
        return 'text-[#FAAD14] bg-[#FAAD14]/10 border-[#FAAD14]/20';
      case '事件完结':
        return 'text-[#1677FF] bg-[#1677FF]/10 border-[#1677FF]/20';
      case '审核驳回':
      case '上游审核驳回':
        return 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/20';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const toggleLog = (id: string) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEvent: ExceptionEvent = {
      id: `EE-${Date.now()}`,
      eventNo: `EX${Date.now()}`,
      eventType: formData.get('eventType') as string,
      description: formData.get('description') as string,
      dispatchNo: formData.get('dispatchNo') as string,
      relatedOrders: ['DO20240521001'], // Mock
      incomeAmount: Number(formData.get('incomeAmount')),
      incomeType: '装车费', // Mock
      costAmount: Number(formData.get('costAmount')),
      costType: '装车费', // Mock
      weight: Number(formData.get('weight')),
      volume: Number(formData.get('volume')),
      allocationMethod: formData.get('allocationMethod') as any,
      shipper: '顺丰速运', // Mock auto-fill
      driverName: '司机张', // Mock auto-fill
      driverContact: '13800000000', // Mock auto-fill
      attachments: ['file1.jpg'], // Mock
      status: '待调度审核',
      reporter: '当前用户',
      reportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      auditLogs: []
    };
    setEvents([newEvent, ...events]);
    setAddModalOpen(false);
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = formData.get('result') as '通过' | '驳回';
    const remark = formData.get('remark') as string;
    
    if (auditModal.event) {
      setEvents(prev => prev.map(ev => {
        if (ev.id === auditModal.event!.id) {
          let nextStatus = ev.status;
          if (result === '通过') {
            if (ev.status === '待调度审核') nextStatus = '待财务审核';
            else if (ev.status === '待财务审核') nextStatus = '待上游审核';
            else if (ev.status === '待上游审核') nextStatus = '待司机确认';
            else if (ev.status === '待司机确认') nextStatus = '事件完结';
          } else {
            if (ev.status === '待上游审核') nextStatus = '上游审核驳回';
            else nextStatus = '审核驳回';
          }
          
          return {
            ...ev,
            status: nextStatus,
            auditor: '当前审核员',
            auditLogs: [
              ...ev.auditLogs,
              {
                auditor: '当前审核员',
                auditTime: new Date().toLocaleString('zh-CN', { hour12: false }),
                result,
                remark
              }
            ]
          };
        }
        return ev;
      }));
    }
    setAuditModal({ isOpen: false, event: null });
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative font-sans">
      {/* Role Switcher (For Demo) */}
      <div className="absolute top-[-40px] right-0 flex items-center gap-2 text-sm z-10">
        <span className="text-slate-500">当前视角:</span>
        <select 
          className="border border-slate-200 rounded px-2 py-1 text-slate-700 bg-white"
          value={role}
          onChange={e => setRole(e.target.value as Role)}
        >
          <option value="carrier">承运方</option>
          <option value="upstream">上游</option>
          <option value="driver">司机</option>
        </select>
      </div>

      {/* Filter Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-4 h-[80px] flex items-center shrink-0">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <select 
            className="w-[180px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all text-[#1D2129]"
            value={filters.eventType}
            onChange={e => setFilters({...filters, eventType: e.target.value})}
          >
            <option value="">请选择事件类型</option>
            <option value="全部">全部</option>
            <option value="装车事件">装车事件</option>
            <option value="卸车费">卸车费</option>
            <option value="装车小费">装车小费</option>
            <option value="卸车小费">卸车小费</option>
            <option value="盘车费">盘车费</option>
            <option value="回单丢失">回单丢失</option>
            <option value="货损">货损</option>
          </select>
          <select 
            className="w-[180px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all text-[#1D2129]"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">请选择事件状态</option>
            <option value="全部">全部</option>
            <option value="待调度审核">待调度审核</option>
            <option value="待财务审核">待财务审核</option>
            <option value="审核驳回">审核驳回</option>
            <option value="待上游审核">待上游审核</option>
            <option value="上游审核驳回">上游审核驳回</option>
            <option value="待司机确认">待司机确认</option>
            <option value="事件完结">事件完结</option>
          </select>
          <input 
            type="text" 
            placeholder="请输入事件编号" 
            className="w-[180px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all placeholder:text-[#909399]"
            value={filters.eventNo}
            onChange={e => setFilters({...filters, eventNo: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="请输入派车单编号" 
            className="w-[180px] h-8 px-3 bg-white border border-[#DCDFE6] rounded text-sm focus:outline-none focus:border-[#1677FF] transition-all placeholder:text-[#909399]"
            value={filters.dispatchNo}
            onChange={e => setFilters({...filters, dispatchNo: e.target.value})}
          />
          
          <div className="flex-1 flex justify-end gap-2">
            <button onClick={handleReset} className="px-4 py-1.5 bg-[#F2F3F5] text-[#4E5969] rounded hover:bg-[#E5E6EB] text-sm transition-colors">重置</button>
            <button onClick={() => setCurrentPage(1)} className="px-4 py-1.5 bg-[#1677FF] text-white rounded hover:bg-[#4096FF] text-sm transition-colors">查询</button>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-4 h-[60px] flex items-center shrink-0">
        <button 
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-1.5 bg-[#1677FF] text-white rounded hover:bg-[#4096FF] text-sm transition-colors font-medium"
        >
          + 新增事件
        </button>
      </div>

      {/* List Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[2000px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#F2F3F5] text-[#1D2129] text-sm font-bold h-10">
                <th className="px-4 py-2 w-12 border-b border-slate-200 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-[#1677FF]/30 transition-all cursor-pointer"
                      checked={paginatedEvents.length > 0 && selectedIds.length === paginatedEvents.length}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(paginatedEvents.map(ev => ev.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </div>
                </th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('eventNo')}>
                  事件编号 {sortConfig?.key === 'eventNo' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">事件类型</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">事件描述</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">关联业务单据</th>
                
                {/* Role-based amounts */}
                {role !== 'driver' && <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">收入金额</th>}
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">收入类型</th>
                {role !== 'upstream' && <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">成本金额</th>}
                {role !== 'upstream' && <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">成本类型</th>}
                
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">重量</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">货量</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">分摊方式</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发货方</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">司机及联系方式</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">附件</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">事件状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">事件上报人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('reportTime')}>
                  上报时间 {sortConfig?.key === 'reportTime' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">审核人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-[#F2F3F5] shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#4E5969]">
              {paginatedEvents.map(ev => {
                const isSelected = selectedIds.includes(ev.id);
                const isExpanded = expandedLogs[ev.id];
                
                // Dynamic fee fields logic
                const showFees = ['装车事件', '卸车费', '装车小费', '卸车小费', '盘车费'].includes(ev.eventType);

                return (
                  <React.Fragment key={ev.id}>
                    <tr className={`border-b border-slate-100 h-10 transition-colors duration-200 group ${isSelected ? 'bg-[#E6F7FF]' : 'hover:bg-[#F5F7FA]'}`}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-[#1677FF]/30 transition-all cursor-pointer"
                            checked={isSelected}
                            onChange={e => {
                              if (e.target.checked) setSelectedIds([...selectedIds, ev.id]);
                              else setSelectedIds(selectedIds.filter(id => id !== ev.id));
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-[#1D2129] whitespace-nowrap">{ev.eventNo}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.eventType}</td>
                      <td className="px-4 py-2 whitespace-nowrap truncate max-w-[150px]" title={ev.description}>{ev.description}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-xs">
                          <div>{ev.dispatchNo}</div>
                          <div className="text-slate-400">({ev.relatedOrders.length}个订单)</div>
                        </div>
                      </td>
                      
                      {role !== 'driver' && (
                        <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-700">
                          {role === 'upstream' ? `成本 ¥${ev.incomeAmount}` : `¥${ev.incomeAmount}`}
                        </td>
                      )}
                      <td className="px-4 py-2 whitespace-nowrap">{ev.incomeType}</td>
                      
                      {role !== 'upstream' && (
                        <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-700">
                          {role === 'driver' ? `收入 ¥${ev.costAmount}` : `¥${ev.costAmount}`}
                        </td>
                      )}
                      {role !== 'upstream' && <td className="px-4 py-2 whitespace-nowrap">{ev.costType}</td>}
                      
                      <td className="px-4 py-2 whitespace-nowrap">{ev.weight}t</td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.volume}m³</td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.allocationMethod}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.shipper}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div>{ev.driverName}</div>
                        <div className="text-xs text-slate-400">{ev.driverContact}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {ev.attachments.length > 0 ? (
                          <div className="flex items-center text-[#1677FF] cursor-pointer hover:underline">
                            <Paperclip size={14} className="mr-1" />
                            {ev.attachments.length}个
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStatusColor(ev.status)}`}>
                          {ev.status}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.reporter}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs">{ev.reportTime}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{ev.auditor || '-'}</td>
                      <td className={`px-4 py-2 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white group-hover:bg-[#F5F7FA]'}`}>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDetailModal({ isOpen: true, event: ev })}
                            className="text-[#1677FF] hover:underline text-sm transition-colors"
                          >
                            查看
                          </button>
                          <button 
                            onClick={() => setAuditModal({ isOpen: true, event: ev })}
                            className={`text-sm transition-colors ${['待调度审核', '待上游审核'].includes(ev.status) ? 'text-[#1677FF] hover:underline' : 'text-[#909399] cursor-not-allowed'}`}
                            disabled={!['待调度审核', '待上游审核'].includes(ev.status)}
                          >
                            审核
                          </button>
                          {ev.auditLogs.length > 0 && (
                            <button 
                              onClick={() => toggleLog(ev.id)}
                              className="text-slate-500 hover:text-slate-700 transition-colors flex items-center"
                            >
                              日志 {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expandable Audit Logs */}
                    {isExpanded && ev.auditLogs.length > 0 && (
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <td colSpan={20} className="px-8 py-3">
                          <div className="text-xs text-slate-500 font-medium mb-2">审核日志记录：</div>
                          <div className="space-y-2">
                            {ev.auditLogs.map((log, idx) => (
                              <div key={idx} className="flex items-center gap-4 text-xs bg-white p-2 rounded border border-slate-200">
                                <span className="text-slate-700 w-24">{log.auditTime}</span>
                                <span className="text-slate-700 w-20">{log.auditor}</span>
                                <span className={`font-medium w-12 ${log.result === '通过' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.result}</span>
                                <span className="text-slate-500 flex-1">备注: {log.remark || '-'}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {paginatedEvents.length === 0 && (
                <tr>
                  <td colSpan={20} className="py-20 text-center">
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
            共 {filteredEvents.length} 条记录
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

      {/* Add Event Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">新增异常事件</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">事件类型 <span className="text-red-500">*</span></label>
                    <select name="eventType" required className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                      <option value="">请选择事件类型</option>
                      <option value="装车事件">装车事件</option>
                      <option value="卸车费">卸车费</option>
                      <option value="装车小费">装车小费</option>
                      <option value="卸车小费">卸车小费</option>
                      <option value="盘车费">盘车费</option>
                      <option value="回单丢失">回单丢失</option>
                      <option value="货损">货损</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">关联单据 <span className="text-red-500">*</span></label>
                    <select name="dispatchNo" required className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                      <option value="">请选择派车单</option>
                      <option value="DP20240521001">DP20240521001 (2个订单)</option>
                      <option value="DP20240521002">DP20240521002 (1个订单)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">事件描述 <span className="text-red-500">*</span></label>
                  <textarea name="description" required rows={3} placeholder="请输入事件描述" className="w-full p-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">收入金额 <span className="text-xs text-slate-400 font-normal">(发货方需额外支出金额)</span></label>
                    <input type="number" name="incomeAmount" className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">成本金额 <span className="text-xs text-slate-400 font-normal">(额外支付司机金额)</span></label>
                    <input type="number" name="costAmount" className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">重量 (t)</label>
                    <input type="number" name="weight" className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">货量 (m³)</label>
                    <input type="number" name="volume" className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">分摊方式 <span className="text-red-500">*</span></label>
                    <select name="allocationMethod" required className="w-full h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                      <option value="平均分摊">平均分摊</option>
                      <option value="按订单手动分摊">按订单手动分摊</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">发货方 (自动带出)</label>
                    <div className="text-sm text-slate-900">顺丰速运</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">司机及联系方式 (自动带出)</label>
                    <div className="text-sm text-slate-900">司机张 13800000000</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">附件上传</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer bg-slate-50">
                    <Paperclip size={24} className="mb-2" />
                    <span className="text-sm">点击或拖拽文件到此处上传</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 rounded border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">取消</button>
                <button type="submit" className="px-4 py-2 rounded bg-[#1677FF] text-white text-sm hover:bg-blue-600 transition-colors">确认提交</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {auditModal.isOpen && auditModal.event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">审核异常事件</h3>
              <button onClick={() => setAuditModal({ isOpen: false, event: null })} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAuditSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">事件编号</label>
                  <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">{auditModal.event.eventNo}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">审核结果 <span className="text-red-500">*</span></label>
                  <select name="result" required className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                    <option value="">请选择审核结果</option>
                    <option value="通过">通过</option>
                    <option value="驳回">驳回</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">驳回原因 <span className="text-xs text-slate-400 font-normal">(驳回时必填)</span></label>
                  <textarea name="remark" rows={3} placeholder="请输入驳回原因..." className="w-full p-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setAuditModal({ isOpen: false, event: null })} className="px-4 py-2 rounded border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">取消</button>
                <button type="submit" className="px-4 py-2 rounded bg-[#1677FF] text-white text-sm hover:bg-blue-600 transition-colors">确认提交</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.isOpen && detailModal.event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">事件详情</h3>
              <button onClick={() => setDetailModal({ isOpen: false, event: null })} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">基本信息</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex"><span className="text-slate-500 w-24">事件编号：</span><span className="text-slate-900">{detailModal.event.eventNo}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">事件类型：</span><span className="text-slate-900">{detailModal.event.eventType}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">关联单据：</span><span className="text-slate-900">{detailModal.event.dispatchNo}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">事件状态：</span><span className={`font-medium ${getStatusColor(detailModal.event.status).split(' ')[0]}`}>{detailModal.event.status}</span></div>
                  <div className="flex col-span-2"><span className="text-slate-500 w-24 shrink-0">事件描述：</span><span className="text-slate-900">{detailModal.event.description}</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">金额与分摊</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex"><span className="text-slate-500 w-24">收入金额：</span><span className="text-slate-900">¥{detailModal.event.incomeAmount} ({detailModal.event.incomeType})</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">成本金额：</span><span className="text-slate-900">¥{detailModal.event.costAmount} ({detailModal.event.costType})</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">重量：</span><span className="text-slate-900">{detailModal.event.weight}t</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">货量：</span><span className="text-slate-900">{detailModal.event.volume}m³</span></div>
                  <div className="flex col-span-2"><span className="text-slate-500 w-24">分摊方式：</span><span className="text-slate-900">{detailModal.event.allocationMethod}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">审核记录</h4>
                {detailModal.event.auditLogs.length > 0 ? (
                  <div className="space-y-2">
                    {detailModal.event.auditLogs.map((log, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-slate-900">{log.auditor}</span>
                          <span className="text-slate-500">{log.auditTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${log.result === '通过' ? 'text-emerald-600' : 'text-rose-600'}`}>[{log.result}]</span>
                          <span className="text-slate-600">{log.remark || '无备注'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">暂无审核记录</div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button onClick={() => setDetailModal({ isOpen: false, event: null })} className="px-4 py-2 rounded border border-slate-200 text-slate-600 text-sm hover:bg-white transition-colors">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
