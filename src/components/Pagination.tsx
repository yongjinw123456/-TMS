import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination: React.FC = () => {
  return (
    <div className="bg-white px-6 py-3 border-t border-gray-100 flex items-center justify-end rounded-b-lg shadow-sm">
      <div className="flex items-center space-x-4 text-sm text-[#1D2129]">
        <span className="text-[#86909C]">共 120 条</span>
        
        <div className="flex items-center space-x-2">
          <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#165DFF] transition-colors bg-white cursor-pointer">
            <option value="10">10 条/页</option>
            <option value="20">20 条/页</option>
            <option value="50">50 条/页</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded border border-gray-200 text-gray-400 hover:text-[#165DFF] hover:border-[#165DFF] disabled:opacity-50 transition-colors">
            <ChevronLeft size={16} />
          </button>
          
          <button className="w-8 h-8 rounded border border-[#165DFF] bg-[#165DFF] text-white flex items-center justify-center font-medium">
            1
          </button>
          <button className="w-8 h-8 rounded border border-gray-200 hover:border-[#165DFF] hover:text-[#165DFF] flex items-center justify-center transition-colors">
            2
          </button>
          <button className="w-8 h-8 rounded border border-gray-200 hover:border-[#165DFF] hover:text-[#165DFF] flex items-center justify-center transition-colors">
            3
          </button>
          <span className="px-1 text-gray-400">...</span>
          <button className="w-8 h-8 rounded border border-gray-200 hover:border-[#165DFF] hover:text-[#165DFF] flex items-center justify-center transition-colors">
            12
          </button>
          
          <button className="p-1 rounded border border-gray-200 text-gray-600 hover:text-[#165DFF] hover:border-[#165DFF] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-[#86909C]">跳至</span>
          <input 
            type="text" 
            className="w-12 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-[#165DFF] transition-colors" 
            defaultValue="1"
          />
          <span className="text-[#86909C]">页</span>
        </div>
      </div>
    </div>
  );
};
