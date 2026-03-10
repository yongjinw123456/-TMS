import React, { useState, useMemo } from 'react';
import { Order, StowagePlan } from '../types';
import { 
  Search, Box, Truck, AlertCircle, CheckCircle, 
  Trash2, Info, X, ChevronDown, Settings, MapPin, Calendar, Layers, ArrowRight
} from 'lucide-react';

interface StowageManagementProps {
  orders: Order[];
  onAssignToPlan: (orderIds: string[], vehicleType: string) => void;
  onViewDetails: (order: Order) => void;
}

export const StowageManagement: React.FC<StowageManagementProps> = ({ orders, onAssignToPlan, onViewDetails }) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [plans, setPlans] = useState<StowagePlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState('4.2m厢式');
  
  // Move Order Modal State
  const [moveModal, setMoveModal] = useState<{ isOpen: boolean; orderId: string; sourcePlanId: string } | null>(null);
  const [targetPlanId, setTargetPlanId] = useState<string>('');

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
    customer: '',
    route: '',
  });

  const unassignedOrders = useMemo(() => {
    return orders.filter(o => o.status === '待配载' && !plans.some(p => p.orders.some(po => po.id === o.id)));
  }, [orders, plans]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleCreateManualPlan = () => {
    if (selectedOrderIds.length === 0) return;
    const selectedOrders = unassignedOrders.filter(o => selectedOrderIds.includes(o.id));
    const newPlan: StowagePlan = {
      id: Date.now().toString(),
      planNo: `PLN${Date.now().toString().slice(-8)}`,
      vehicleType,
      orders: selectedOrders,
      totalWeight: selectedOrders.length * 5,
      totalVolume: selectedOrders.length * 15,
      stowageRate: Math.min(85 + Math.floor(Math.random() * 15), 100),
      status: '待发车',
      strategy: '手动配载',
      createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      operator: '调度员张三'
    };
    setPlans([newPlan, ...plans]);
    setSelectedOrderIds([]);
    setIsManualModalOpen(false);
    showToast('配载方案生成成功');
  };

  const handleCreateAutoPlan = (strategy: string) => {
    if (selectedOrderIds.length === 0) return;
    const selectedOrders = unassignedOrders.filter(o => selectedOrderIds.includes(o.id));
    
    // Simulate generating multiple plans if there are many orders
    const newPlans: StowagePlan[] = [];
    const ordersPerPlan = 5;
    
    for (let i = 0; i < selectedOrders.length; i += ordersPerPlan) {
      const planOrders = selectedOrders.slice(i, i + ordersPerPlan);
      newPlans.push({
        id: `${Date.now()}-${i}`,
        planNo: `PLN${Date.now().toString().slice(-8)}${i}`,
        vehicleType: strategy === '车型优先' ? '9.6m高栏' : '4.2m厢式',
        orders: planOrders,
        totalWeight: planOrders.length * 5,
        totalVolume: planOrders.length * 15,
        stowageRate: Math.min(92 + Math.floor(Math.random() * 8), 100),
        status: '待发车',
        strategy,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        operator: 'AI 智能调度'
      });
    }

    setPlans([...newPlans, ...plans]);
    setSelectedOrderIds([]);
    setIsAutoModalOpen(false);
    showToast(`已生成${newPlans.length}个配载方案，0个订单配载失败`);
  };

  const handleDeletePlan = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '删除配载方案',
      message: '删除配载后，该方案下的所有订单将自动释放回未配载订单列表。是否确认继续？',
      onConfirm: () => {
        setPlans(plans.filter(p => p.id !== id));
        if (selectedPlanId === id) setSelectedPlanId(null);
        showToast('方案已删除，订单已释放');
      }
    });
  };

  const handleReleaseOrder = (planId: string, orderId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '释放订单',
      message: '释放后，该订单将回到未配载订单列表。是否确认继续？',
      onConfirm: () => {
        setPlans(plans.map(p => {
          if (p.id === planId) {
            return { ...p, orders: p.orders.filter(o => o.id !== orderId) };
          }
          return p;
        }));
        showToast('订单已成功释放');
      }
    });
  };

  const handleMoveOrder = () => {
    if (!moveModal || !targetPlanId) return;
    
    setPlans(prevPlans => {
      const sourcePlan = prevPlans.find(p => p.id === moveModal.sourcePlanId);
      const targetPlan = prevPlans.find(p => p.id === targetPlanId);
      if (!sourcePlan || !targetPlan) return prevPlans;

      const orderToMove = sourcePlan.orders.find(o => o.id === moveModal.orderId);
      if (!orderToMove) return prevPlans;

      return prevPlans.map(p => {
        if (p.id === moveModal.sourcePlanId) {
          return { ...p, orders: p.orders.filter(o => o.id !== moveModal.orderId) };
        }
        if (p.id === targetPlanId) {
          return { ...p, orders: [...p.orders, orderToMove] };
        }
        return p;
      });
    });
    
    setMoveModal(null);
    setTargetPlanId('');
    showToast('订单已成功移动至新方案');
  };

  const getLoadRateColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getLoadRateTextColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="flex flex-col h-full space-y-5 relative font-sans">
      {/* Premium Toast Notification */}
      {localToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-8 fade-in duration-300 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={14} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium tracking-wide">{localToast}</span>
        </div>
      )}

      {/* Three Columns Layout */}
      <div className="flex-1 flex gap-5 min-h-0">
        
        {/* ================= LEFT: Unassigned Orders ================= */}
        <div className="flex-[1.3] bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden relative">
          <div className="p-5 border-b border-slate-100 flex flex-col gap-5 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <Layers size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 tracking-tight">未配载订单</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-xs font-medium">{unassignedOrders.length}</span>
              </div>
            </div>

            {/* Premium Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索订单号" 
                  className="w-[160px] h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                  value={filters.orderNo}
                  onChange={e => setFilters({...filters, orderNo: e.target.value})}
                />
              </div>
              <select 
                className="w-[140px] h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-600 appearance-none"
                value={filters.customer}
                onChange={e => setFilters({...filters, customer: e.target.value})}
              >
                <option value="">所有客户</option>
                <option value="百事可乐">百事可乐</option>
                <option value="农夫山泉">农夫山泉</option>
              </select>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="路线 (如: 深圳-广州)" 
                  className="w-[180px] h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                  value={filters.route}
                  onChange={e => setFilters({...filters, route: e.target.value})}
                />
              </div>
              <div className="flex-1 flex justify-end gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-all shadow-sm">重置</button>
                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium transition-all shadow-sm">查询</button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
              <button 
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedOrderIds.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 translate-y-[-1px]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                disabled={selectedOrderIds.length === 0}
                onClick={() => setIsAutoModalOpen(true)}
              >
                <Box size={16} />
                智能配载
              </button>
              <button 
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedOrderIds.length > 0 ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm translate-y-[-1px]' : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'}`}
                disabled={selectedOrderIds.length === 0}
                onClick={() => setIsManualModalOpen(true)}
              >
                <Settings size={16} />
                手动配载
              </button>
              {selectedOrderIds.length > 0 && (
                <span className="ml-auto text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full animate-in fade-in">
                  已选择 {selectedOrderIds.length} 项
                </span>
              )}
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto relative bg-white">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50/90 backdrop-blur-sm text-slate-500 text-xs font-semibold tracking-wider uppercase h-11">
                  <th className="px-5 py-3 w-12 border-b border-slate-200 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                        checked={unassignedOrders.length > 0 && selectedOrderIds.length === unassignedOrders.length}
                        onChange={e => {
                          if (e.target.checked) setSelectedOrderIds(unassignedOrders.map(o => o.id));
                          else setSelectedOrderIds([]);
                        }}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">订单号</th>
                  <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">客户名称</th>
                  <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">路线</th>
                  <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">重量/体积</th>
                  <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">最迟发货</th>
                  <th className="px-5 py-3 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-slate-50/90 backdrop-blur-sm shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {unassignedOrders.map(o => {
                  const isSelected = selectedOrderIds.includes(o.id);
                  return (
                    <tr key={o.id} className={`border-b border-slate-100 h-14 transition-all duration-200 group ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                            checked={isSelected}
                            onChange={e => {
                              if (e.target.checked) setSelectedOrderIds([...selectedOrderIds, o.id]);
                              else setSelectedOrderIds(selectedOrderIds.filter(id => id !== o.id));
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-slate-600 whitespace-nowrap">{o.orderNo}</td>
                      <td className="px-4 py-3 truncate max-w-[120px] font-medium whitespace-nowrap" title={o.customerName}>{o.customerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="text-xs font-medium">{o.routeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">{o.settleVolume}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap flex items-center gap-1.5 mt-1">
                        <Calendar size={12} className="text-slate-400" />
                        {o.requireSendTime}
                      </td>
                      <td className={`px-5 py-3 whitespace-nowrap sticky right-0 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors text-right ${isSelected ? 'bg-blue-50/40' : 'bg-white group-hover:bg-slate-50/80'}`}>
                        <button onClick={() => onViewDetails(o)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors">详情</button>
                      </td>
                    </tr>
                  );
                })}
                {unassignedOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <Box size={32} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">暂无待配载订单</p>
                        <p className="text-xs text-slate-400 mt-1">所有订单均已完成配载规划</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MIDDLE: Stowage Plans Cards ================= */}
        <div className="flex-[0.9] bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                <Truck size={18} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 tracking-tight">配载方案</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-xs font-medium">{plans.length}</span>
          </div>
          
          <div className="flex-1 overflow-auto p-5 space-y-4 bg-slate-50/30">
            {plans.map(plan => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div 
                  key={plan.id} 
                  className={`group relative bg-white rounded-xl p-5 cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? 'border-blue-500 shadow-md ring-4 ring-blue-500/10' 
                      : 'border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {/* Delete Button - Premium Position */}
                  <button 
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                      isSelected ? 'opacity-100 bg-rose-50 text-rose-500 hover:bg-rose-100' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlan(plan.id);
                    }}
                    title="删除方案"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="pr-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-slate-800 tracking-tight">{plan.planNo}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {plan.strategy}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">{plan.operator}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">承运车型</span>
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Truck size={14} className="text-slate-400" />
                        {plan.vehicleType}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">包含订单</span>
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Box size={14} className="text-slate-400" />
                        {plan.orders.length} <span className="text-xs font-normal text-slate-500">单</span>
                      </span>
                    </div>
                  </div>

                  {/* Premium Progress Bar */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-medium text-slate-500">空间装载率</span>
                      <span className={`text-lg font-bold ${getLoadRateTextColor(plan.stowageRate)} leading-none`}>
                        {plan.stowageRate}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getLoadRateColor(plan.stowageRate)}`}
                        style={{ width: `${plan.stowageRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {plans.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                  <Truck size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">暂无配载方案</p>
                <p className="text-xs text-slate-400 mt-1">请在左侧选择订单生成方案</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: Plan Details ================= */}
        <div className="flex-[1.4] bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
          {selectedPlan ? (
            <>
              {/* Premium Detail Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedPlan.planNo}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>创建于 {selectedPlan.createTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Settings size={12}/> {selectedPlan.strategy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">承运车型</span>
                      <span className="text-sm font-semibold text-slate-800">{selectedPlan.vehicleType}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-100 pl-4">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">总重量</span>
                      <span className="text-sm font-semibold text-slate-800">{selectedPlan.totalWeight} <span className="text-xs text-slate-500 font-normal">t</span></span>
                    </div>
                    <div className="flex flex-col border-l border-slate-100 pl-4">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">总订单</span>
                      <span className="text-sm font-semibold text-slate-800">{selectedPlan.orders.length} <span className="text-xs text-slate-500 font-normal">单</span></span>
                    </div>
                    <div className="flex flex-col border-l border-slate-100 pl-4">
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">综合装载率</span>
                      <span className={`text-sm font-bold ${getLoadRateTextColor(selectedPlan.stowageRate)}`}>{selectedPlan.stowageRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Table */}
              <div className="flex-1 overflow-auto relative bg-white">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-slate-50/90 backdrop-blur-sm text-slate-500 text-xs font-semibold tracking-wider uppercase h-11">
                      <th className="px-5 py-3 whitespace-nowrap border-b border-slate-200">订单号</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">客户名称</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">路线</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">重量/体积</th>
                      <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">最迟发货</th>
                      <th className="px-5 py-3 whitespace-nowrap border-b border-slate-200 sticky right-0 bg-slate-50/90 backdrop-blur-sm shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] z-30 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {selectedPlan.orders.map(o => (
                      <tr key={o.id} className="border-b border-slate-100 h-14 hover:bg-slate-50/80 transition-colors group">
                        <td className="px-5 py-3 font-mono text-xs font-medium text-slate-600 whitespace-nowrap">{o.orderNo}</td>
                        <td className="px-4 py-3 truncate max-w-[100px] font-medium whitespace-nowrap" title={o.customerName}>{o.customerName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                            <MapPin size={12} className="text-slate-400" />
                            <span className="text-xs font-medium">{o.routeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{o.settleVolume}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {o.requireSendTime}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50/80 shadow-[-12px_0_15px_-5px_rgba(0,0,0,0.03)] transition-colors text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => onViewDetails(o)} className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">详情</button>
                            <div className="w-px h-3 bg-slate-200 mx-1"></div>
                            <button onClick={() => setMoveModal({ isOpen: true, orderId: o.id, sourcePlanId: selectedPlan.id })} className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">移动</button>
                            <div className="w-px h-3 bg-slate-200 mx-1"></div>
                            <button onClick={() => handleReleaseOrder(selectedPlan.id, o.id)} className="text-slate-500 hover:text-rose-600 text-xs font-medium px-2 py-1.5 rounded hover:bg-rose-50 transition-colors">释放</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {selectedPlan.orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-slate-400">
                          该方案下暂无订单
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5 border border-slate-100">
                <Layers size={32} className="text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">未选择方案</h3>
              <p className="text-sm text-slate-500">请在中间列表选择一个配载方案以查看详情</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Manual Stowage Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[520px] flex flex-col overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">手动配载</h2>
                  <p className="text-xs text-slate-500 mt-0.5">为选中的订单分配承运车辆</p>
                </div>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">已选订单摘要</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-blue-600 leading-none mb-1">{selectedOrderIds.length}</span>
                    <span className="text-xs font-medium text-slate-500">订单数量</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-800 leading-none mb-1">{selectedOrderIds.length * 5}<span className="text-sm text-slate-500 ml-1">t</span></span>
                    <span className="text-xs font-medium text-slate-500">预估总重量</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-800 leading-none mb-1">{selectedOrderIds.length * 15}<span className="text-sm text-slate-500 ml-1">m³</span></span>
                    <span className="text-xs font-medium text-slate-500">预估总体积</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">分配承运车型 <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white hover:border-slate-300 text-slate-700 font-medium shadow-sm"
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                  >
                    <option value="4.2m厢式">4.2m 厢式货车 (载重约5t, 体积约15m³)</option>
                    <option value="9.6m高栏">9.6m 高栏货车 (载重约18t, 体积约55m³)</option>
                    <option value="17.5m平板">17.5m 平板货车 (载重约30t, 体积约100m³)</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsManualModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white hover:text-slate-900 transition-colors shadow-sm">取消</button>
              <button onClick={handleCreateManualPlan} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">确认生成配载</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Stowage Modal */}
      {isAutoModalOpen && (
        <AutoStowageModal 
          selectedCount={selectedOrderIds.length}
          onClose={() => setIsAutoModalOpen(false)}
          onConfirm={handleCreateAutoPlan}
        />
      )}

      {/* Move Order Modal */}
      {moveModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[440px] flex flex-col overflow-hidden zoom-in-95 animate-in duration-200 border border-slate-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">移动订单</h2>
                  <p className="text-xs text-slate-500 mt-0.5">将订单转移至其他配载方案</p>
                </div>
              </div>
              <button onClick={() => setMoveModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">选择目标配载方案</label>
              <div className="relative">
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white hover:border-slate-300 text-slate-700 font-medium shadow-sm"
                  value={targetPlanId}
                  onChange={e => setTargetPlanId(e.target.value)}
                >
                  <option value="">-- 请选择目标方案 --</option>
                  {plans.filter(p => p.id !== moveModal.sourcePlanId).map(p => (
                    <option key={p.id} value={p.id}>{p.planNo} ({p.vehicleType}) - 当前装载率 {p.stowageRate}%</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setMoveModal(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white hover:text-slate-900 transition-colors shadow-sm">取消</button>
              <button 
                onClick={handleMoveOrder} 
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all shadow-sm ${targetPlanId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-slate-300 cursor-not-allowed'}`}
                disabled={!targetPlanId}
              >
                确认移动
              </button>
            </div>
          </div>
        </div>
      )}

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

const AutoStowageModal = ({ selectedCount, onClose, onConfirm }: { selectedCount: number, onClose: () => void, onConfirm: (strategy: string) => void }) => {
  const [strategy, setStrategy] = useState('空间最大化');
  const [spaceThreshold, setSpaceThreshold] = useState(90);
  const [weightFloat, setWeightFloat] = useState(5);
  
  const strategies = [
    { name: '空间最大化', desc: '优先利用车辆车厢空间，减少空间浪费', icon: <Box size={20} /> },
    { name: '载重最大化', desc: '优先利用车辆载重能力，适合重货', icon: <Settings size={20} /> },
    { name: '车型优先', desc: '优先选择9.6m等大容量车型，提升单车运力', icon: <Truck size={20} /> },
    { name: '路线协同', desc: '根据收货地址智能规划最优路线', icon: <MapPin size={20} /> },
    { name: '紧急优先', desc: '优先配载要求发货时间较早的订单', icon: <AlertCircle size={20} /> },
    { name: '经济配载', desc: '综合考虑成本，实现运费最低化', icon: <CheckCircle size={20} /> }
  ];

  const currentStrategy = strategies.find(s => s.name === strategy);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[960px] h-[680px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Box size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">智能配载引擎</h2>
              <p className="text-xs text-slate-500 mt-0.5">AI驱动的最优装载方案生成</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
        </div>
        
        {/* Summary Bar */}
        <div className="px-8 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">处理订单</span>
              <span className="text-base font-bold text-slate-800">{selectedCount} <span className="text-xs font-normal text-slate-500">单</span></span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">预估总重量</span>
              <span className="text-base font-bold text-slate-800">{selectedCount * 5} <span className="text-xs font-normal text-slate-500">t</span></span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">预估总体积</span>
              <span className="text-base font-bold text-slate-800">{selectedCount * 15} <span className="text-xs font-normal text-slate-500">m³</span></span>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            引擎就绪
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-white">
          {/* Left: Strategies Cards */}
          <div className="w-[45%] border-r border-slate-100 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">选择优化策略</div>
            {strategies.map(s => (
              <div 
                key={s.name}
                className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                  strategy === s.name 
                    ? 'border-blue-500 bg-white shadow-md ring-4 ring-blue-500/10' 
                    : 'border-transparent bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
                onClick={() => setStrategy(s.name)}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    strategy === s.name ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${strategy === s.name ? 'text-blue-600' : 'text-slate-800'}`}>{s.name}</span>
                      {strategy === s.name && <CheckCircle size={18} className="text-blue-500" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Strategy Details */}
          <div className="w-[55%] p-8 overflow-y-auto bg-white flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Settings size={18} className="text-slate-400" />
              <h3 className="text-base font-bold text-slate-800">高级参数配置</h3>
            </div>

            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">空间利用率阈值</span>
                  <span className="text-xs text-slate-500 mt-0.5">设定车厢空间的最低装载目标</span>
                </div>
                <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{spaceThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" max="100" 
                value={spaceThreshold} 
                onChange={(e) => setSpaceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                <span>50% (宽松)</span>
                <span>100% (极限)</span>
              </div>
            </div>

            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">载重浮动范围</span>
                  <span className="text-xs text-slate-500 mt-0.5">允许超过标准载重的最大百分比</span>
                </div>
                <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">±{weightFloat}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="20" 
                value={weightFloat} 
                onChange={(e) => setWeightFloat(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                <span>0% (严格)</span>
                <span>20% (灵活)</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">装载模拟预览</div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative overflow-hidden shadow-inner">
                {/* Truck Visualization - Premium */}
                <div className="flex items-end h-28 w-full max-w-md mx-auto relative">
                  {/* Road line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-300"></div>
                  
                  {/* Truck Cab */}
                  <div className="w-20 h-20 bg-slate-700 rounded-tl-2xl rounded-tr-lg border-r-2 border-white flex items-center justify-center relative z-10 shadow-md">
                    <div className="absolute top-3 right-2 w-8 h-8 bg-sky-100/20 rounded-md backdrop-blur-sm border border-white/10"></div>
                    <div className="absolute -bottom-3 right-3 w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-300 shadow-sm"></div>
                  </div>
                  
                  {/* Truck Body */}
                  <div className="flex-1 h-24 bg-white border-2 border-slate-300 rounded-tr-lg relative flex items-end p-1.5 gap-1.5 shadow-sm z-10">
                    {/* Cargo blocks */}
                    <div className="bg-blue-100 h-[85%] w-[35%] rounded border border-blue-200 flex items-center justify-center shadow-sm">
                      <Box size={16} className="text-blue-400" />
                    </div>
                    <div className="bg-emerald-100 h-[60%] w-[25%] rounded border border-emerald-200 flex items-center justify-center shadow-sm">
                      <Box size={16} className="text-emerald-400" />
                    </div>
                    <div className="bg-amber-100 h-[95%] w-[20%] rounded border border-amber-200 flex items-center justify-center shadow-sm">
                      <Box size={16} className="text-amber-400" />
                    </div>
                    
                    {/* Empty space indicator */}
                    <div className="absolute inset-0 bg-blue-600/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] rounded-tr-md">
                      <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 shadow-sm border border-blue-100">
                        预计装载率 {spaceThreshold}%
                      </span>
                    </div>

                    {/* Wheels */}
                    <div className="absolute -bottom-3 left-6 w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-300 shadow-sm"></div>
                    <div className="absolute -bottom-3 right-6 w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-300 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-4 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">取消</button>
          <button onClick={() => onConfirm(strategy)} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">启动智能配载</button>
        </div>
      </div>
    </div>
  );
};
