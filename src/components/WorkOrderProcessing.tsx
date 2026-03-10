import React, { useState, useMemo } from 'react';
import { WorkOrder } from '../types';
import { 
  Search, Box, Map as MapIcon, Navigation, AlertTriangle, 
  ChevronLeft, ChevronRight, CheckCircle, Activity, ShieldAlert, X
} from 'lucide-react';
import { TrackModal } from './TrackModal';

interface WorkOrderProcessingProps {
  orders: WorkOrder[];
}

export const WorkOrderProcessing: React.FC<WorkOrderProcessingProps> = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackModal, setTrackModal] = useState<{ isOpen: boolean; record: any | null }>({ isOpen: false, record: null });
  const [processModal, setProcessModal] = useState<{ isOpen: boolean; order: WorkOrder | null }>({ isOpen: false, order: null });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; order: WorkOrder | null }>({ isOpen: false, order: null });

  // Filters state
  const [filters, setFilters] = useState({
    dispatchNo: '',
    driverName: '',
    driverContact: '',
    plateNo: '',
    supplier: '',
    vehicleType: '',
    status: '',
    trackStatus: '',
    processStatus: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (filters.dispatchNo && !o.dispatchNo.includes(filters.dispatchNo)) return false;
      if (filters.driverName && !o.driverName.includes(filters.driverName)) return false;
      if (filters.driverContact && !o.driverContact.includes(filters.driverContact)) return false;
      if (filters.plateNo && !o.plateNo.includes(filters.plateNo)) return false;
      if (filters.supplier && o.supplier !== filters.supplier) return false;
      if (filters.vehicleType && o.vehicleType !== filters.vehicleType) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.trackStatus && o.trackStatus !== filters.trackStatus) return false;
      if (filters.processStatus && o.processStatus !== filters.processStatus) return false;
      return true;
    });
  }, [orders, filters]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const handleReset = () => {
    setFilters({
      dispatchNo: '',
      driverName: '',
      driverContact: '',
      plateNo: '',
      supplier: '',
      vehicleType: '',
      status: '',
      trackStatus: '',
      processStatus: ''
    });
    setCurrentPage(1);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = formData.get('processResult') as string;
    
    if (processModal.order) {
      setOrders(prev => prev.map(o => 
        o.id === processModal.order!.id 
          ? { 
              ...o, 
              processStatus: '已处理', 
              processResult: result, 
              processor: '当前用户', 
              processTime: new Date().toLocaleString('zh-CN', { hour12: false }) 
            } 
          : o
      ));
    }
    setProcessModal({ isOpen: false, order: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '运输中': return 'text-blue-600 bg-blue-50 border-blue-200';
      case '已结束': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getTrackStatusColor = (status: string) => {
    if (status === '正常') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status.includes('异常')) return 'text-rose-600 bg-rose-50 border-rose-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
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
            className="w-[160px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.dispatchNo}
            onChange={e => setFilters({...filters, dispatchNo: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="请输入司机姓名" 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.driverName}
            onChange={e => setFilters({...filters, driverName: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="请输入联系方式" 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.driverContact}
            onChange={e => setFilters({...filters, driverContact: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="请输入车牌号" 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.plateNo}
            onChange={e => setFilters({...filters, plateNo: e.target.value})}
          />
          <select 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.supplier}
            onChange={e => setFilters({...filters, supplier: e.target.value})}
          >
            <option value="">请选择发货方</option>
            <option value="顺丰速运">顺丰速运</option>
            <option value="京东物流">京东物流</option>
            <option value="中通快运">中通快运</option>
          </select>
          <select 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.vehicleType}
            onChange={e => setFilters({...filters, vehicleType: e.target.value})}
          >
            <option value="">请选择车型</option>
            <option value="4.2m厢式">4.2m厢式</option>
            <option value="9.6m高栏">9.6m高栏</option>
          </select>
          <select 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部运输状态</option>
            <option value="运输中">运输中</option>
            <option value="已结束">已结束</option>
          </select>
          <select 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.trackStatus}
            onChange={e => setFilters({...filters, trackStatus: e.target.value})}
          >
            <option value="">全部轨迹状态</option>
            <option value="正常">正常</option>
            <option value="异常L1">异常L1</option>
            <option value="异常L2">异常L2</option>
            <option value="异常L3">异常L3</option>
            <option value="异常L4">异常L4</option>
          </select>
          <select 
            className="w-[140px] h-8 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
            value={filters.processStatus}
            onChange={e => setFilters({...filters, processStatus: e.target.value})}
          >
            <option value="">全部处理状态</option>
            <option value="待处理">待处理</option>
            <option value="已处理">已处理</option>
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
          <table className="w-full text-left border-collapse min-w-[2400px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#F2F3F5] text-[#1D2129] text-[14px] font-bold h-10">
                <th className="px-4 py-2 w-12 border-b border-slate-200 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                      checked={paginatedOrders.length > 0 && selectedIds.length === paginatedOrders.length}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(paginatedOrders.map(o => o.id));
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
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">发车时间</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">到达时间<span className="text-xs text-slate-400 font-normal block">(到达首个收货点)</span></th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">预估距离</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">轨迹丢失时长</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">预警等级</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">运输状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">轨迹状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理状态</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理人</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理时间</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">处理结果</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">物流订单号</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">货物名称</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">货物数量</th>
                <th className="px-4 py-2 whitespace-nowrap border-b border-slate-200">地址明细</th>
                <th className="px-5 py-2 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-[#F2F3F5] shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-slate-700">
              {paginatedOrders.map(o => {
                const isSelected = selectedIds.includes(o.id);
                return (
                  <tr key={o.id} className={`border-b border-slate-100 h-10 transition-colors duration-200 group ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white hover:bg-[#F5F7FA]'}`}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) setSelectedIds([...selectedIds, o.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== o.id));
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600 whitespace-nowrap">{o.dispatchNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.supplier}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.vehicleType}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{o.plateNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.driverName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.driverContact}</td>
                    <td className="px-4 py-2 font-mono text-slate-500 whitespace-nowrap">{o.departureTime}</td>
                    <td className="px-4 py-2 font-mono text-slate-500 whitespace-nowrap">-</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.estimatedDistance}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-rose-500 font-medium">{o.lostDuration}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.exceptionLevel}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getTrackStatusColor(o.trackStatus)}`}>
                        {o.trackStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getProcessStatusColor(o.processStatus)}`}>
                        {o.processStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.processor}</td>
                    <td className="px-4 py-2 font-mono text-slate-500 whitespace-nowrap">{o.processTime}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.processResult}</td>
                    <td className="px-4 py-2 font-mono text-slate-600 whitespace-nowrap">DO202405210001</td>
                    <td className="px-4 py-2 whitespace-nowrap">饮料/瓶坯</td>
                    <td className="px-4 py-2 whitespace-nowrap">5t</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-xs">
                        <div className="truncate w-[150px] text-slate-500" title="发货: 浙江省杭州市西湖区文一西路">发: 浙江省杭州市西湖区文一西路</div>
                        <div className="truncate w-[150px] text-slate-900" title="收货: 上海市浦东新区张江高科技园区">收: 上海市浦东新区张江高科技园区</div>
                      </div>
                    </td>
                    <td className={`px-5 py-2 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors text-right ${isSelected ? 'bg-[#E6F7FF]' : 'bg-white group-hover:bg-[#F5F7FA]'}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setTrackModal({ isOpen: true, record: o })} 
                          className="text-[#1677FF] hover:underline text-[14px] font-medium transition-all"
                        >
                          查看轨迹
                        </button>
                        {o.processStatus === '待处理' && (
                          <>
                            <div className="w-px h-3 bg-slate-200 mx-1"></div>
                            <button 
                              onClick={() => setProcessModal({ isOpen: true, order: o })} 
                              className="text-[#1677FF] hover:underline text-[14px] font-medium transition-all"
                            >
                              填写处理结果
                            </button>
                          </>
                        )}
                        <div className="w-px h-3 bg-slate-200 mx-1"></div>
                        <button 
                          onClick={() => setDetailModal({ isOpen: true, order: o })} 
                          className="text-[#1677FF] hover:underline text-[14px] font-medium transition-all"
                        >
                          查看详情
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={23} className="py-20 text-center">
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
            共 {filteredOrders.length} 条记录
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

      {/* Process Modal */}
      {processModal.isOpen && processModal.order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">填写处理结果</h3>
              <button 
                onClick={() => setProcessModal({ isOpen: false, order: null })}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleProcessSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">工单编号</label>
                  <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">{processModal.order.dispatchNo}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">处理结果 <span className="text-rose-500">*</span></label>
                  <select 
                    name="processResult"
                    required
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
                  >
                    <option value="">请选择处理结果</option>
                    <option value="已电联-已接通">已电联-已接通</option>
                    <option value="已电联-未接通">已电联-未接通</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">处理备注</label>
                  <textarea 
                    name="remark"
                    rows={4}
                    placeholder="请输入处理备注信息..."
                    className="w-full p-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setProcessModal({ isOpen: false, order: null })} 
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1677FF] text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  确认提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.isOpen && detailModal.order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">工单详情</h3>
              <button 
                onClick={() => setDetailModal({ isOpen: false, order: null })}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">基本信息</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex"><span className="text-slate-500 w-24">派车单号：</span><span className="text-slate-900">{detailModal.order.dispatchNo}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">发货方：</span><span className="text-slate-900">{detailModal.order.supplier}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">车牌号：</span><span className="text-slate-900">{detailModal.order.plateNo}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">车型：</span><span className="text-slate-900">{detailModal.order.vehicleType}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">司机姓名：</span><span className="text-slate-900">{detailModal.order.driverName}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">联系方式：</span><span className="text-slate-900">{detailModal.order.driverContact}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">轨迹异常信息</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex"><span className="text-slate-500 w-24">轨迹状态：</span><span className="text-rose-600 font-medium">{detailModal.order.trackStatus}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">预警等级：</span><span className="text-slate-900">{detailModal.order.exceptionLevel}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">丢失时长：</span><span className="text-slate-900">{detailModal.order.lostDuration}</span></div>
                  <div className="flex"><span className="text-slate-500 w-24">发车时间：</span><span className="text-slate-900">{detailModal.order.departureTime}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-600 pl-2 mb-3">处理记录</h4>
                {detailModal.order.processStatus === '已处理' ? (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
                    <div className="grid grid-cols-2 gap-y-2 mb-2">
                      <div className="flex"><span className="text-slate-500 w-20">处理状态：</span><span className="text-blue-600 font-medium">已处理</span></div>
                      <div className="flex"><span className="text-slate-500 w-20">处理结果：</span><span className="text-slate-900">{detailModal.order.processResult}</span></div>
                      <div className="flex"><span className="text-slate-500 w-20">处理人：</span><span className="text-slate-900">{detailModal.order.processor}</span></div>
                      <div className="flex"><span className="text-slate-500 w-20">处理时间：</span><span className="text-slate-900">{detailModal.order.processTime}</span></div>
                    </div>
                    <div className="flex mt-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-500 w-20 shrink-0">处理备注：</span>
                      <span className="text-slate-900">已联系司机，司机表示经过山区信号不好，目前已驶出山区，预计半小时后恢复信号。</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">暂无处理记录</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
