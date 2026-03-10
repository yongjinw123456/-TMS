import React from 'react';
import { X } from 'lucide-react';
import { Order } from '../types';

interface ReceiveAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ReceiveAppointmentModal: React.FC<ReceiveAppointmentModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#1D2129]">收货预约</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">订单号:</span> <span className="font-medium">{order.orderNo}</span></div>
              <div><span className="text-gray-500">发货时间:</span> <span className="font-medium">{order.requireSendTime}</span></div>
              <div><span className="text-gray-500">预计到货时间:</span> <span className="font-medium">2026-03-06 10:00</span></div>
              <div><span className="text-gray-500">车型:</span> <span className="font-medium">{order.transportType}</span></div>
              <div><span className="text-gray-500">收货人:</span> <span className="font-medium">{order.receiver}</span></div>
              <div><span className="text-gray-500">收货人联系方式:</span> <span className="font-medium">{order.receiverContact}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3 text-[#1D2129]">货物信息</h4>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs text-left">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">货物名称</th>
                  <th className="px-3 py-2 border border-gray-200">重量</th>
                  <th className="px-3 py-2 border border-gray-200">单位</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-600">
                  <td className="px-3 py-2 border border-gray-200">{order.goodsCategory}</td>
                  <td className="px-3 py-2 border border-gray-200">{order.settleVolume}</td>
                  <td className="px-3 py-2 border border-gray-200">吨</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 rounded border border-gray-300 text-[#1D2129] text-sm font-medium hover:bg-gray-50 transition-colors">关闭</button>
          <button onClick={onClose} className="px-6 py-2 rounded bg-[#165DFF] text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">确定预约</button>
        </div>
      </div>
    </div>
  );
};
