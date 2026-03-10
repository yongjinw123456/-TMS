import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Order } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'view';
  order?: Order | null;
}

interface CargoItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, mode, order }) => {
  if (!isOpen) return null;

  const isView = mode === 'view';
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(
    order ? [{ id: '1', productName: '示例商品', quantity: 10, unit: '箱' }] : []
  );
  const [settlementUnit, setSettlementUnit] = useState('吨');

  const addCargoItem = () => {
    setCargoItems([...cargoItems, { id: Date.now().toString(), productName: '', quantity: 0, unit: '箱' }]);
  };

  const removeCargoItem = (id: string) => {
    setCargoItems(cargoItems.filter(item => item.id !== id));
  };

  const updateCargoItem = (id: string, field: keyof CargoItem, value: string | number) => {
    setCargoItems(cargoItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#1D2129]">{isView ? '订单详情' : '新增订单'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 基础信息 */}
          <section>
            <h3 className="text-sm font-bold text-[#1D2129] mb-4 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-[#165DFF] before:mr-2 before:rounded-sm">
              基础信息
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">订单号 <span className="text-red-500">*</span></label>
                <input type="text" disabled value={order?.orderNo || "DO20231024103000001"} className="border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">订单创建方式</label>
                <input type="text" disabled={isView} placeholder="请输入创建方式" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">下单时间</label>
                <input type="datetime-local" disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">结费货量</label>
                <div className="flex items-center">
                  <input type="text" disabled={isView} defaultValue={order?.settleVolume?.replace(/[^\d.]/g, '') || ''} placeholder="如：5" className="border border-gray-300 rounded-l px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
                  <select 
                    value={settlementUnit}
                    onChange={(e) => setSettlementUnit(e.target.value)}
                    disabled={isView}
                    className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#165DFF] disabled:cursor-not-allowed"
                  >
                    <option value="吨">吨</option>
                    <option value="立方米">立方米</option>
                    <option value="标箱">标箱</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 客户信息 */}
          <section>
            <h3 className="text-sm font-bold text-[#1D2129] mb-4 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-[#165DFF] before:mr-2 before:rounded-sm">
              客户信息
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">收货方姓名</label>
                <input type="text" disabled={isView} defaultValue={order?.receiver || ''} placeholder="请输入收货方姓名" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">收货方联系方式</label>
                <input type="text" defaultValue={order?.receiverContact || ''} placeholder="姓名 + 手机号" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">运输类型 <span className="text-red-500">*</span></label>
                <select disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed">
                  <option>{order?.transportType || '4.2m厢式'}</option>
                  {!isView && (
                    <>
                      <option>9.6m高栏</option>
                      <option>17.5m平板</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">账单结费时间</label>
                <input type="date" disabled={isView} defaultValue={order?.billSettleTime || ''} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">最晚发货时间</label>
                <input type="datetime-local" disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all text-gray-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">客户名称 <span className="text-red-500">*</span></label>
                <input type="text" disabled={isView} defaultValue={order?.customerName || ''} placeholder="发货方企业名称" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">客户联系方式</label>
                <input type="text" disabled={isView} defaultValue={order?.senderContact || ''} placeholder="姓名 + 手机号" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">合同名称</label>
                <input type="text" disabled={isView} defaultValue={order?.routeName || ''} placeholder="请输入合同名称" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">线路名称</label>
                <input type="text" disabled={isView} defaultValue={order?.routeName || ''} placeholder="请输入线路名称" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5 col-span-2">
                <label className="text-xs text-[#86909C] font-medium">发货地址 <span className="text-red-500">*</span></label>
                <div className="flex space-x-2">
                  <select disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm w-1/3 focus:outline-none focus:border-[#165DFF] bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed">
                    <option>{order?.sendAddress || '省/市/区/街道'}</option>
                  </select>
                  <input type="text" disabled={isView} defaultValue={order?.sendAddress || ''} placeholder="详细地址" className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 col-span-2">
                <label className="text-xs text-[#86909C] font-medium">收货地址 <span className="text-red-500">*</span></label>
                <div className="flex space-x-2">
                  <select disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm w-1/3 focus:outline-none focus:border-[#165DFF] bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed">
                    <option>{order?.receiveAddress || '省/市/区/街道'}</option>
                  </select>
                  <input type="text" disabled={isView} defaultValue={order?.receiveAddress || ''} placeholder="详细地址" className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
                </div>
              </div>
            </div>
          </section>

          {/* 货物信息 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1D2129] flex items-center before:content-[''] before:w-1 before:h-4 before:bg-[#165DFF] before:mr-2 before:rounded-sm">
                货物信息
              </h3>
              {!isView && (
                <button onClick={addCargoItem} className="text-xs text-[#165DFF] flex items-center hover:text-blue-700">
                  <Plus size={14} className="mr-1" /> 新增货物
                </button>
              )}
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs text-left">
                  <th className="px-3 py-2 border border-gray-200">商品名称</th>
                  <th className="px-3 py-2 border border-gray-200 w-24">货物数量</th>
                  <th className="px-3 py-2 border border-gray-200 w-24">货物单位</th>
                  {!isView && <th className="px-3 py-2 border border-gray-200 w-16">操作</th>}
                </tr>
              </thead>
              <tbody>
                {cargoItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 border border-gray-200">
                      <input type="text" disabled={isView} value={item.productName} onChange={(e) => updateCargoItem(item.id, 'productName', e.target.value)} className="w-full border-none focus:outline-none" />
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <input type="number" disabled={isView} value={item.quantity} onChange={(e) => updateCargoItem(item.id, 'quantity', Number(e.target.value))} className="w-full border-none focus:outline-none" />
                    </td>
                    <td className="px-3 py-2 border border-gray-200">
                      <select disabled={isView} value={item.unit} onChange={(e) => updateCargoItem(item.id, 'unit', e.target.value)} className="w-full border-none focus:outline-none">
                        <option>箱</option>
                        <option>托</option>
                        <option>件</option>
                      </select>
                    </td>
                    {!isView && (
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        <button onClick={() => removeCargoItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 费用信息 */}
          <section>
            <h3 className="text-sm font-bold text-[#1D2129] mb-4 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-[#165DFF] before:mr-2 before:rounded-sm">
              费用信息
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">运输费 (元)</label>
                <input type="number" disabled={isView} placeholder="0.00" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">装车费 (元)</label>
                <input type="number" disabled={isView} placeholder="0.00" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">卸车费 (元)</label>
                <input type="number" disabled={isView} placeholder="0.00" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-[#86909C] font-medium">费用合计 (元)</label>
                <input type="text" disabled placeholder="自动计算" className="border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 font-bold text-[#1D2129] cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5 col-span-2">
                <label className="text-xs text-[#86909C] font-medium">结算方式 <span className="text-red-500">*</span></label>
                <select disabled={isView} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#165DFF] bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed">
                  <option>月度固定日期结算</option>
                  <option>现结</option>
                  <option>日结</option>
                  <option>周结</option>
                  <option>半月结</option>
                  <option>月结</option>
                  <option>双月结</option>
                  <option>季结</option>
                  <option>半年结</option>
                </select>
              </div>
            </div>
          </section>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 rounded border border-gray-300 text-[#1D2129] text-sm font-medium hover:bg-gray-50 transition-colors">
            {isView ? '关闭' : '取消'}
          </button>
          {!isView && (
            <button onClick={onClose} className="px-6 py-2 rounded bg-[#165DFF] text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
              保存
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

