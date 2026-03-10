import React from 'react';
import { Plus, Upload, Users, Download, Trash2, RefreshCw, Calendar } from 'lucide-react';

interface ActionsProps {
  onNewOrder: () => void;
  onBatchAssign: () => void;
  onBatchAppointment: () => void;
  onVoid: () => void;
}

export const Actions: React.FC<ActionsProps> = ({ 
  onNewOrder, 
  onBatchAssign, 
  onBatchAppointment, 
  onVoid 
}) => {
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onNewOrder}
          className="bg-[#165DFF] text-white px-4 py-1.5 rounded text-sm flex items-center hover:bg-blue-600 transition-colors shadow-sm font-medium"
        >
          <Plus size={16} className="mr-1.5" />
          新增订单
        </button>
        
        <button className="bg-white border border-gray-300 text-[#1D2129] px-4 py-1.5 rounded text-sm flex items-center hover:bg-gray-50 transition-colors shadow-sm font-medium">
          <Upload size={16} className="mr-1.5 text-gray-500" />
          批量导入
        </button>
        
        <button 
          onClick={onBatchAssign}
          className="bg-white border border-gray-300 text-[#1D2129] px-4 py-1.5 rounded text-sm flex items-center hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <Users size={16} className="mr-1.5 text-gray-500" />
          批量指派
        </button>

        <button 
          onClick={onBatchAppointment}
          className="bg-white border border-gray-300 text-[#1D2129] px-4 py-1.5 rounded text-sm flex items-center hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <Calendar size={16} className="mr-1.5 text-gray-500" />
          批量发起预约
        </button>
        
        <button className="bg-white border border-gray-300 text-[#1D2129] px-4 py-1.5 rounded text-sm flex items-center hover:bg-gray-50 transition-colors shadow-sm font-medium">
          <Download size={16} className="mr-1.5 text-gray-500" />
          导出 Excel
        </button>
        
        <button 
          onClick={onVoid}
          className="bg-white border border-gray-300 text-[#F53F3F] px-4 py-1.5 rounded text-sm flex items-center hover:bg-red-50 transition-colors shadow-sm font-medium"
        >
          <Trash2 size={16} className="mr-1.5" />
          订单作废
        </button>
      </div>
      
      <button className="p-1.5 text-gray-500 hover:text-[#165DFF] hover:bg-blue-50 rounded transition-colors" title="刷新">
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

