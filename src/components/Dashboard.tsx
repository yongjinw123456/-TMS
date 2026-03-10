import React from 'react';
import { TrendingUp, Package, AlertCircle, CheckCircle, Truck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="flex gap-4 mb-5">
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm text-[#86909C] mb-1 font-medium">今日待处理</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold font-mono text-[#1D2129]">24</span>
            <span className="ml-2 text-xs text-[#00B42A] flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <TrendingUp size={12} className="mr-1" />
              12%
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#165DFF]">
          <Package size={24} />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm text-[#86909C] mb-1 font-medium">在途订单</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold font-mono text-[#1D2129]">18</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#FF7D00]">
          <Truck size={24} />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm text-[#86909C] mb-1 font-medium">异常订单</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold font-mono text-[#F53F3F]">3</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#F53F3F]">
          <AlertCircle size={24} />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm text-[#86909C] mb-1 font-medium">今日已完成</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold font-mono text-[#1D2129]">45</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00B42A]">
          <CheckCircle size={24} />
        </div>
      </div>
    </div>
  );
};
