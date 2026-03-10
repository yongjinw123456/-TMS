import React from 'react';
import { X } from 'lucide-react';
import { Order } from '../types';

interface BatchAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onConfirm: (carrierId: string) => void;
}

export const BatchAssignModal: React.FC<BatchAssignModalProps> = ({ isOpen, onClose, orders, onConfirm }) => {
  if (!isOpen) return null;

  const assignable = orders.filter(o => o.status === '待处理');
  const unassignable = orders.filter(o => o.status !== '待处理');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#1D2129]">批量指派</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-sm font-bold text-[#1D2129] mb-4 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-[#165DFF] before:mr-2 before:rounded-sm">
              可指派订单 ({assignable.length})
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs text-left">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">订单号</th>
                  <th className="px-3 py-2 border border-gray-200">客户名称</th>
                  <th className="px-3 py-2 border border-gray-200">线路名称</th>
                  <th className="px-3 py-2 border border-gray-200">发货地址</th>
                  <th className="px-3 py-2 border border-gray-200">收货地址</th>
                  <th className="px-3 py-2 border border-gray-200">发货时间</th>
                  <th className="px-3 py-2 border border-gray-200">订单状态</th>
                </tr>
              </thead>
              <tbody>
                {assignable.map(o => (
                  <tr key={o.id} className="text-gray-600">
                    <td className="px-3 py-2 border border-gray-200">{o.orderNo}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.customerName}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.routeName}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.sendAddress}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.receiveAddress}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.requireSendTime}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section>
            <h3 className="text-sm font-bold text-[#1D2129] mb-4 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-red-500 before:mr-2 before:rounded-sm">
              不可指派订单 ({unassignable.length})
            </h3>
            <table className="w-full text-sm border-collapse opacity-60">
              <thead className="bg-gray-50 text-gray-500 text-xs text-left">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">订单号</th>
                  <th className="px-3 py-2 border border-gray-200">客户名称</th>
                  <th className="px-3 py-2 border border-gray-200">线路名称</th>
                  <th className="px-3 py-2 border border-gray-200">发货地址</th>
                  <th className="px-3 py-2 border border-gray-200">收货地址</th>
                  <th className="px-3 py-2 border border-gray-200">发货时间</th>
                  <th className="px-3 py-2 border border-gray-200">订单状态</th>
                </tr>
              </thead>
              <tbody>
                {unassignable.map(o => (
                  <tr key={o.id} className="text-gray-600">
                    <td className="px-3 py-2 border border-gray-200">{o.orderNo}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.customerName}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.routeName}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.sendAddress}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.receiveAddress}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.requireSendTime}</td>
                    <td className="px-3 py-2 border border-gray-200">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-bold text-[#1D2129]">选择承运商 <span className="text-red-500">*</span></label>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all">
                <option value="">请选择承运商</option>
                <option value="1">承运商A</option>
                <option value="2">承运商B</option>
              </select>
            </div>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 rounded border border-gray-300 text-[#1D2129] text-sm font-medium hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={() => onConfirm('1')} className="px-6 py-2 rounded bg-[#165DFF] text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
};
