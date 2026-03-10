import React, { useState } from 'react';
import { 
  Menu, 
  FileText, 
  Truck, 
  Map, 
  DollarSign, 
  ChevronDown, 
  ChevronRight,
  Layout,
  ShieldAlert,
  ClipboardList,
  Box
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate: (page: 'dashboard' | 'stowage' | 'appointment' | 'track' | 'workorder' | 'exception') => void;
  currentPage: 'dashboard' | 'stowage' | 'appointment' | 'track' | 'workorder' | 'exception';
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onNavigate, currentPage }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['物流管理', '在途管理', '在途轨迹监控']);

  const toggleMenu = (menuName: string) => {
    if (isCollapsed) {
      onToggle();
    }
    setExpandedMenus((prev) => 
      prev.includes(menuName) 
        ? prev.filter((m) => m !== menuName) 
        : [...prev, menuName]
    );
  };

  const menus = [
    {
      name: '物流管理',
      icon: <FileText size={18} />,
      children: [{ name: '物流订单管理' }, { name: '收货预约管理' }, { name: '配载管理' }],
    },
    {
      name: '接单池与派单管理',
      icon: <Truck size={18} />,
      children: [{ name: '派车单管理' }, { name: '接单池管理' }],
    },
    {
      name: '现场管理',
      icon: <Box size={18} />,
      children: [{ name: '现场管理列表' }],
    },
    {
      name: '在途管理',
      icon: <Map size={18} />,
      children: [
        { 
          name: '在途轨迹监控', 
          children: [{ name: '在途轨迹监控列表' }, { name: '工单处理列表' }] 
        },
        { name: '异常事件管理' },
        { name: '异常行为监控' }, 
        { name: '异常事件上报' }
      ],
    },
    {
      name: '财务管理',
      icon: <DollarSign size={18} />,
      children: [{ name: '应收管理' }, { name: '应付管理' }, { name: '保证金管理' }],
    },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-[64px]' : 'w-[220px]'
      }`}
    >
      <div className="h-[64px] flex items-center justify-center border-b border-gray-200 cursor-pointer" onClick={onToggle}>
        <Menu size={20} className="text-gray-500 hover:text-blue-600 transition-colors" />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {menus.map((menu) => (
          <div key={menu.name} className="mb-1">
            <div 
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors ${
                !isCollapsed && expandedMenus.includes(menu.name) ? 'font-medium' : ''
              }`}
              onClick={() => toggleMenu(menu.name)}
            >
              <div className="flex items-center justify-center w-6 h-6 mr-3 text-gray-500">
                {menu.icon}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm truncate">{menu.name}</span>
                  {menu.children && (
                    <span className="text-gray-400">
                      {expandedMenus.includes(menu.name) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </>
              )}
            </div>
            {!isCollapsed && menu.children && expandedMenus.includes(menu.name) && (
              <div className="bg-gray-50 py-1">
                {menu.children.map((child) => (
                  <div key={child.name}>
                    <div 
                      className={`pl-12 pr-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                        (child.name === '物流订单管理' && currentPage === 'dashboard') || 
                        (child.name === '配载管理' && currentPage === 'stowage') ||
                        (child.name === '收货预约管理' && currentPage === 'appointment') ||
                        (child.name === '异常事件管理' && currentPage === 'exception')
                          ? 'text-[#165DFF] bg-blue-50 font-medium border-r-2 border-[#165DFF]' 
                          : 'text-gray-600 hover:text-[#165DFF] hover:bg-blue-50/50'
                      }`}
                      onClick={() => {
                        if (child.children) {
                          toggleMenu(child.name);
                        } else {
                          if (child.name === '物流订单管理') onNavigate('dashboard');
                          if (child.name === '配载管理') onNavigate('stowage');
                          if (child.name === '收货预约管理') onNavigate('appointment');
                          if (child.name === '异常事件管理') onNavigate('exception');
                        }
                      }}
                    >
                      <span>{child.name}</span>
                      {child.children && (
                        <span className="text-gray-400">
                          {expandedMenus.includes(child.name) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      )}
                    </div>
                    {child.children && expandedMenus.includes(child.name) && (
                      <div className="py-1">
                        {child.children.map((subChild) => (
                          <div
                            key={subChild.name}
                            className={`pl-16 pr-4 py-2 text-sm cursor-pointer transition-colors ${
                              (subChild.name === '在途轨迹监控列表' && currentPage === 'track') ||
                              (subChild.name === '工单处理列表' && currentPage === 'workorder')
                                ? 'text-[#165DFF] bg-blue-50 font-medium border-r-2 border-[#165DFF]' 
                                : 'text-gray-500 hover:text-[#165DFF] hover:bg-blue-50/50'
                            }`}
                            onClick={() => {
                              if (subChild.name === '在途轨迹监控列表') onNavigate('track');
                              if (subChild.name === '工单处理列表') onNavigate('workorder');
                            }}
                          >
                            {subChild.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

