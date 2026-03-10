import React from 'react';
import { Bell, User, LogOut, ChevronRight } from 'lucide-react';

interface TopNavProps {
  currentPage: 'dashboard' | 'stowage' | 'appointment' | 'track' | 'workorder' | 'exception';
}

export const TopNav: React.FC<TopNavProps> = ({ currentPage }) => {
  const getBreadcrumb = () => {
    switch (currentPage) {
      case 'dashboard': return '物流订单管理';
      case 'stowage': return '配载管理';
      case 'appointment': return '收货预约管理';
      case 'track': return '在途轨迹监控列表';
      case 'workorder': return '工单处理列表';
      case 'exception': return '异常事件管理';
      default: return '';
    }
  };

  const getParentMenu = () => {
    switch (currentPage) {
      case 'dashboard': 
      case 'stowage': 
      case 'appointment': 
        return ['物流管理'];
      case 'track': 
      case 'workorder': 
        return ['在途管理', '在途轨迹监控'];
      case 'exception':
        return ['在途管理'];
      default: return [];
    }
  };

  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center mr-8">
          <div className="w-8 h-8 bg-[#165DFF] rounded-lg flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-lg font-bold text-[#1D2129] tracking-tight">智慧物流TMS</span>
        </div>
        
        <div className="flex items-center text-sm text-[#86909C]">
          {getParentMenu().map((menu, index) => (
            <React.Fragment key={menu}>
              <span className="hover:text-[#165DFF] cursor-pointer transition-colors">{menu}</span>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
            </React.Fragment>
          ))}
          <span className="text-[#1D2129] font-medium">{getBreadcrumb()}</span>
        </div>
      </div>

      
      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer group">
          <Bell size={20} className="text-gray-500 group-hover:text-[#165DFF] transition-colors" />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#F53F3F] rounded-full text-[10px] text-white flex items-center justify-center font-medium border-2 border-white">
            3
          </span>
        </div>
        
        <div className="flex items-center cursor-pointer group">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
            <User size={16} className="text-[#165DFF]" />
          </div>
          <span className="text-sm text-[#1D2129] font-medium mr-1">调度员张三</span>
        </div>
        
        <div className="w-px h-4 bg-gray-200"></div>
        
        <div className="cursor-pointer group flex items-center text-gray-500 hover:text-[#F53F3F] transition-colors">
          <LogOut size={18} />
          <span className="ml-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">退出</span>
        </div>
      </div>
    </header>
  );
};
