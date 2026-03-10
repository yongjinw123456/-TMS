import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { 
  Search, Box, AlertCircle, CheckCircle, 
  Trash2, Info, X, ChevronDown, Settings, MapPin, Calendar, Layers,
  ChevronLeft, ChevronRight, Plus, FileText, Upload
} from 'lucide-react';
import { OrderDrawer } from './OrderDrawer';
import { BatchImportModal } from './BatchImportModal';

interface OrderManagementProps {
  orders: Order[];
  onAssign: (id: string) => void;
  onHandleException: (id: string) => void;
  onViewDetails: (order: Order) => void;
  onReceiveAppointment: (order: Order) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ 
  orders: initialOrders,
  onAssign,
  onHandleException,
  onViewDetails,
  onReceiveAppointment
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('create');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [batchImportVisible, setBatchImportVisible] = useState(false);
  
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
    customerName: '',
    routeName: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (filters.orderNo && !o.orderNo.includes(filters.orderNo)) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.customerName && !o.customerName.includes(filters.customerName)) return false;
      if (filters.routeName && !o.routeName.includes(filters.routeName)) return false;
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
      orderNo: '',
      status: '',
      customerName: '',
      routeName: ''
    });
    setCurrentPage(1);
  };

  const handleVoid = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: '订单作废确认',
      message: `确定要作废选中的 ${selectedIds.length} 条订单吗？作废后数据将不可恢复。`,
      onConfirm: () => {
        setOrders(orders.filter(o => !selectedIds.includes(o.id)));
        setSelectedIds([]);
        showToast('订单已成功作废');
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待处理':
      case '待配载':
      case '待派车':
      case '待接单':
      case '待装车':
      case '待卸货':
      case '待签单':
      case '待结算':
      case '回单待审核':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case '已指派':
      case '已接单':
      case '已到达装货点':
      case '已装车':
      case '运输中':
      case '结算中':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case '预约待处理':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case '预约成功':
      case '已完成':
      case '已处理':
      case '已结算':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case '异常':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case '待处理':
      case '待配载':
      case '待派车':
      case '待接单':
      case '待装车':
      case '待卸货':
      case '待签单':
      case '待结算':
      case '回单待审核':
        return 'bg-amber-500';
      case '已指派':
      case '已接单':
      case '已到达装货点':
      case '已装车':
      case '运输中':
      case '结算中':
        return 'bg-blue-500';
      case '预约待处理':
        return 'bg-purple-500';
      case '预约成功':
      case '已完成':
      case '已处理':
      case '已结算':
        return 'bg-emerald-500';
      case '异常':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索订单号" 
              className="w-[200px] h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
              value={filters.orderNo}
              onChange={e => setFilters({...filters, orderNo: e.target.value})}
            />
          </div>
          <select 
            className="w-[160px] h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 appearance-none"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部状态</option>
            <option value="待处理">待处理</option>
            <option value="待配载">待配载</option>
            <option value="已指派">已指派</option>
            <option value="运输中">运输中</option>
            <option value="已完成">已完成</option>
          </select>
          <input 
            type="text" 
            placeholder="客户名称" 
            className="w-[200px] h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            value={filters.customerName}
            onChange={e => setFilters({...filters, customerName: e.target.value})}
          />
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="路线 (如: 深圳-广州)" 
              className="w-[180px] h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
              value={filters.routeName}
              onChange={e => setFilters({...filters, routeName: e.target.value})}
            />
          </div>
          <div className="flex-1 flex justify-end gap-2">
            <button onClick={handleReset} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-all shadow-sm">重置</button>
            <button onClick={() => setCurrentPage(1)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-sm shadow-blue-600/20">查询</button>
          </div>
        </div>
      </div>

      {/* Action Bar & List Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setDrawerMode('create'); setDrawerVisible(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-sm shadow-blue-600/20"
            >
              <Plus size={16} />
              新建订单
            </button>
            <button 
              onClick={() => setBatchImportVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all shadow-sm"
            >
              <Upload size={16} />
              批量导入
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedIds.length > 0 ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm' : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'}`}
              disabled={selectedIds.length === 0}
            >
              <FileText size={16} />
              批量指派
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedIds.length > 0 ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm' : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'}`}
              disabled={selectedIds.length === 0}
            >
              <Calendar size={16} />
              批量预约
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedIds.length > 0 ? 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-sm' : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'}`}
              disabled={selectedIds.length === 0}
              onClick={handleVoid}
            >
              <Trash2 size={16} />
              作废
            </button>
          </div>
          {selectedIds.length > 0 && (
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full animate-in fade-in">
              已选择 {selectedIds.length} 项
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50/90 backdrop-blur-sm text-slate-500 text-xs font-semibold tracking-wider uppercase h-11">
                <th className="px-5 py-3 w-12 border-b border-slate-200 whitespace-nowrap">
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
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">订单号</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">客户名称</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">路线</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">收货地址</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">发货地址</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">运输方式</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">货物类别</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">重量/体积</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">要求发货时间</th>
                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">状态</th>
                <th className="px-5 py-3 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-slate-50/90 backdrop-blur-sm shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {paginatedOrders.map(o => {
                const isSelected = selectedIds.includes(o.id);
                return (
                  <tr key={o.id} className={`border-b border-slate-100 h-14 transition-colors duration-200 group ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'}`}>
                    <td className="px-5 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-600 whitespace-nowrap">{o.orderNo}</td>
                    <td className="px-4 py-3 truncate max-w-[150px] font-medium whitespace-nowrap" title={o.customerName}>{o.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-xs font-medium">{o.routeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px] whitespace-nowrap" title={o.receiveAddress}>{o.receiveAddress}</td>
                    <td className="px-4 py-3 truncate max-w-[150px] whitespace-nowrap" title={o.sendAddress}>{o.sendAddress}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{o.transportType}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{o.goodsCategory}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{o.settleVolume}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap flex items-center gap-1.5 mt-1">
                      <Calendar size={12} className="text-slate-400" />
                      {o.requireSendTime}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStatusColor(o.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(o.status)}`}></div>
                        {o.status}
                      </div>
                    </td>
                    <td className={`px-5 py-3 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors text-right ${isSelected ? 'bg-blue-50/40' : 'bg-white group-hover:bg-slate-50/80'}`}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedOrder(o); setDrawerMode('view'); setDrawerVisible(true); }} className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">详情</button>
                        {o.status === '待处理' && (
                          <>
                            <div className="w-px h-3 bg-slate-200 mx-1"></div>
                            <button onClick={() => { onAssign(o.id); showToast('指派成功'); }} className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">指派</button>
                          </>
                        )}
                        <div className="w-px h-3 bg-slate-200 mx-1"></div>
                        <button onClick={() => onReceiveAppointment(o)} className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">收货预约</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <Box size={32} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">暂无数据</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="text-sm text-slate-500 font-medium">
            共 {filteredOrders.length} 条记录
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span>每页显示</span>
              <select 
                className="border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                className={`p-1 rounded-md border ${currentPage === 1 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className={`p-1 rounded-md border ${currentPage === totalPages || totalPages === 0 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <OrderDrawer 
        isOpen={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
        mode={drawerMode}
        order={selectedOrder}
      />
      
      <BatchImportModal
        isOpen={batchImportVisible}
        onClose={() => setBatchImportVisible(false)}
      />

      {/* Premium Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                  <AlertCircle size={24} />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{confirmDialog.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{confirmDialog.message}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setConfirmDialog(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white hover:text-slate-900 transition-colors shadow-sm">取消</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-colors">确认继续</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
