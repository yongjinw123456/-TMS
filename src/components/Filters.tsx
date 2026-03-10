import React, { useState } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';

interface FiltersProps {
  onSearch: (filters: any) => void;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onSearch, onReset }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderNo: '',
    status: '',
    customerName: '',
    source: '',
    sendAddress: '',
    receiveAddress: '',
    createDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      onSearch(formData);
      setLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      orderNo: '',
      status: '',
      customerName: '',
      source: '',
      sendAddress: '',
      receiveAddress: '',
      createDate: ''
    });
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-t-lg border-b border-gray-100 flex flex-wrap gap-x-6 gap-y-4 items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">订单号:</label>
        <div className="relative">
          <input 
            type="text" 
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            placeholder="请输入订单号" 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all"
          />
          <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">订单状态:</label>
        <div className="relative">
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 appearance-none focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all bg-white"
          >
            <option value="">全部状态</option>
            <option value="待处理">待处理</option>
            <option value="已指派">已指派</option>
            <option value="运输中">运输中</option>
            <option value="异常">异常</option>
            <option value="已完成">已完成</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">客户名称:</label>
        <div className="relative">
          <input 
            type="text" 
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="请选择或输入" 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all"
          />
          <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">订单来源:</label>
        <div className="relative">
          <select 
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 appearance-none focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all bg-white"
          >
            <option value="">全部</option>
            <option value="接口推送">接口推送</option>
            <option value="手动创建">手动创建</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">发货地:</label>
        <div className="relative group">
          <select 
            name="sendAddress"
            value={formData.sendAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56 appearance-none focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all bg-white cursor-pointer"
          >
            <option value="">请选择省/市/区</option>
            <optgroup label="浙江省">
              <option value="浙江省-杭州市-西湖区">浙江省-杭州市-西湖区</option>
              <option value="浙江省-杭州市-滨江区">浙江省-杭州市-滨江区</option>
              <option value="浙江省-宁波市-海曙区">浙江省-宁波市-海曙区</option>
            </optgroup>
            <optgroup label="上海市">
              <option value="上海市-浦东新区-陆家嘴">上海市-浦东新区-陆家嘴</option>
              <option value="上海市-黄浦区-外滩">上海市-黄浦区-外滩</option>
            </optgroup>
            <optgroup label="广东省">
              <option value="广东省-广州市-天河区">广东省-广州市-天河区</option>
              <option value="广东省-深圳市-南山区">广东省-深圳市-南山区</option>
            </optgroup>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none group-hover:text-[#165DFF] transition-colors" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">收货地:</label>
        <div className="relative group">
          <select 
            name="receiveAddress"
            value={formData.receiveAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56 appearance-none focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all bg-white cursor-pointer"
          >
            <option value="">请选择省/市/区</option>
            <optgroup label="上海市">
              <option value="上海市-浦东新区-张江">上海市-浦东新区-张江</option>
              <option value="上海市-徐汇区-徐家汇">上海市-徐汇区-徐家汇</option>
            </optgroup>
            <optgroup label="浙江省">
              <option value="浙江省-杭州市-余杭区">浙江省-杭州市-余杭区</option>
              <option value="浙江省-嘉兴市-南湖区">浙江省-嘉兴市-南湖区</option>
            </optgroup>
            <optgroup label="江苏省">
              <option value="江苏省-苏州市-姑苏区">江苏省-苏州市-姑苏区</option>
              <option value="江苏省-南京市-玄武区">江苏省-南京市-玄武区</option>
            </optgroup>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none group-hover:text-[#165DFF] transition-colors" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm text-[#1D2129] font-medium whitespace-nowrap">创建时间:</label>
        <div className="relative group">
          <input 
            type="date" 
            name="createDate"
            value={formData.createDate}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#165DFF] focus:ring-1 focus:ring-[#165DFF] transition-all text-gray-600 cursor-pointer hover:border-[#165DFF]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-auto">
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#165DFF] text-white px-6 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center disabled:opacity-70"
        >
          {loading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
          查询
        </button>
        <button 
          onClick={handleReset}
          className="bg-white border border-gray-300 text-[#1D2129] px-6 py-1.5 rounded text-sm hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          重置
        </button>
      </div>
    </div>
  );
};

