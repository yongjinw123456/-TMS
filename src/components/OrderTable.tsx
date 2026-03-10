import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { ArrowDown, Loader2, AlertCircle } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onAssign: (id: string) => void;
  onHandleException: (id: string) => void;
  onViewDetails: (order: Order) => void;
  onReceiveAppointment: (order: Order) => void;
}

const StatusTag: React.FC<{ status: OrderStatus }> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';
  let borderColor = 'border-gray-200';

  if (status === '待处理') {
    bgColor = 'bg-blue-50';
    textColor = 'text-[#165DFF]';
    borderColor = 'border-blue-200';
  } else if (status === '已指派') {
    bgColor = 'bg-orange-50';
    textColor = 'text-[#FF7D00]';
    borderColor = 'border-orange-200';
  } else if (status === '异常') {
    bgColor = 'bg-red-50';
    textColor = 'text-[#F53F3F]';
    borderColor = 'border-red-200';
  } else if (status === '已完成' || status === '已处理') {
    bgColor = 'bg-green-50';
    textColor = 'text-[#00B42A]';
    borderColor = 'border-green-200';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${bgColor} ${textColor} ${borderColor} whitespace-nowrap`}>
      {status}
    </span>
  );
};

export const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  selectedIds, 
  onSelectChange, 
  onAssign, 
  onHandleException, 
  onViewDetails,
  onReceiveAppointment
}) => {
  const [loadingAssign, setLoadingAssign] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectChange(orders.map(o => o.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter(sid => sid !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  const handleAssignClick = (id: string) => {
    setLoadingAssign(id);
    setTimeout(() => {
      onAssign(id);
      setLoadingAssign(null);
    }, 500);
  };

  return (
    <div className="bg-white overflow-auto shadow-sm flex-1 relative">
      <table className="w-full text-left border-collapse min-w-[1800px]">
        <thead className="sticky top-0 z-20 shadow-sm">
          <tr className="bg-gray-50 text-[#86909C] text-xs font-medium">
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50 w-10">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-[#165DFF] focus:ring-[#165DFF]" 
                checked={orders.length > 0 && selectedIds.length === orders.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">订单号</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">客户名称</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">线路名称</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">发货地址</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">收货地址</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">运输类型</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">货物品项</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">结费货量</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">发货联系人</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">收货方</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">收货联系人</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 group">
              <div className="flex items-center">
                要求发货时间
                <ArrowDown size={14} className="ml-1 text-[#165DFF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">订单状态</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">应收状态</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">应付状态</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 bg-gray-50">账单结费时间</th>
            <th className="px-4 py-3 whitespace-nowrap border-b border-gray-200 sticky right-0 bg-gray-50 z-30 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)]">操作</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[#1D2129]">
          {orders.map((order) => {
            const isException = order.status === '异常';
            
            return (
              <tr 
                key={order.id} 
                className={`border-b border-gray-100 hover:bg-[#E8F3FF] transition-colors h-[48px] group relative ${
                  isException ? 'bg-red-50/30' : ''
                }`}
              >
                {isException && order.exceptionReason && (
                  <td className="p-0">
                    <div className="absolute left-0 top-full mt-1 bg-white border border-red-200 shadow-lg rounded p-2 z-20 text-xs text-[#F53F3F] hidden group-hover:flex items-center whitespace-nowrap">
                      <AlertCircle size={14} className="mr-1" />
                      异常原因: {order.exceptionReason}
                    </div>
                  </td>
                )}
                <td className="px-4 py-2 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[#165DFF] focus:ring-[#165DFF]" 
                    checked={selectedIds.includes(order.id)}
                    onChange={() => handleSelectRow(order.id)}
                  />
                </td>
                <td className={`px-4 py-2 whitespace-nowrap font-mono text-xs ${isException ? 'border-l-4 border-l-[#F53F3F]' : 'border-l-4 border-l-transparent'}`}>
                  {order.orderNo}
                </td>
                <td className="px-4 py-2 whitespace-nowrap truncate max-w-[150px]" title={order.customerName}>{order.customerName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.routeName}</td>
                <td className="px-4 py-2 whitespace-nowrap truncate max-w-[150px]" title={order.sendAddress}>{order.sendAddress}</td>
                <td className="px-4 py-2 whitespace-nowrap truncate max-w-[150px]" title={order.receiveAddress}>{order.receiveAddress}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.transportType}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.goodsCategory}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.settleVolume}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.senderContact}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.receiver}</td>
                <td className="px-4 py-2 whitespace-nowrap">{order.receiverContact}</td>
                <td className="px-4 py-2 whitespace-nowrap font-mono text-xs">{order.requireSendTime}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <StatusTag status={order.status} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-xs">{order.receiveStatus}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs">{order.payStatus}</td>
                <td className="px-4 py-2 whitespace-nowrap font-mono text-xs">{order.billSettleTime}</td>
                <td className={`px-4 py-2 whitespace-nowrap sticky right-0 transition-colors z-10 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)] ${
                  isException ? 'bg-[#fef2f2] group-hover:bg-[#E8F3FF]' : 'bg-white group-hover:bg-[#E8F3FF]'
                }`}>
                  <div className="flex items-center space-x-3 text-[#165DFF] text-xs font-medium">
                    {order.status === '待处理' && (
                      <>
                        <button 
                          className="hover:text-blue-700 transition-colors flex items-center disabled:opacity-50"
                          onClick={() => handleAssignClick(order.id)}
                          disabled={loadingAssign === order.id}
                        >
                          {loadingAssign === order.id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                          指派
                        </button>
                        <button 
                          className="hover:text-blue-700 transition-colors"
                          onClick={() => onReceiveAppointment(order)}
                        >
                          收货预约
                        </button>
                      </>
                    )}
                    {order.status === '异常' && (
                      <button 
                        className="text-[#F53F3F] hover:text-red-700 transition-colors"
                        onClick={() => onHandleException(order.id)}
                      >
                        处理
                      </button>
                    )}
                    <button 
                      className="hover:text-blue-700 transition-colors"
                      onClick={() => onViewDetails(order)}
                    >
                      查看详情
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
