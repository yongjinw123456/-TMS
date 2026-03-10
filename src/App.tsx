import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Filters } from './components/Filters';
import { Actions } from './components/Actions';
import { OrderTable } from './components/OrderTable';
import { Pagination } from './components/Pagination';
import { OrderModal } from './components/OrderModal';
import { BatchAssignModal } from './components/BatchAssignModal';
import { BatchAppointmentModal } from './components/BatchAppointmentModal';
import { ReceiveAppointmentModal } from './components/ReceiveAppointmentModal';
import { StowageManagement } from './components/StowageManagement';
import { AppointmentManagement } from './components/AppointmentManagement';
import { TrackMonitoring } from './components/TrackMonitoring';
import { WorkOrderProcessing } from './components/WorkOrderProcessing';
import { ExceptionEventManagement } from './components/ExceptionEventManagement';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';
import { generateMockOrders, generateMockAppointments, generateMockTrackRecords, generateMockWorkOrders, generateMockExceptionEvents } from './mockData';
import { Order, Appointment, TrackRecord, WorkOrder, ExceptionEvent } from './types';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'view';
    order: Order | null;
  }>({
    isOpen: false,
    mode: 'create',
    order: null,
  });
  const [batchAssignModal, setBatchAssignModal] = useState({ isOpen: false });
  const [batchAppointmentModal, setBatchAppointmentModal] = useState({ isOpen: false });
  const [receiveAppointmentModal, setReceiveAppointmentModal] = useState<{ isOpen: boolean; order: Order | null }>({ isOpen: false, order: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [trackRecords, setTrackRecords] = useState<TrackRecord[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [exceptionEvents, setExceptionEvents] = useState<ExceptionEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'stowage' | 'appointment' | 'track' | 'workorder' | 'exception'>('dashboard');

  useEffect(() => {
    setOrders(generateMockOrders(50));
    setAppointments(generateMockAppointments(50));
    setTrackRecords(generateMockTrackRecords(50));
    setWorkOrders(generateMockWorkOrders(50));
    setExceptionEvents(generateMockExceptionEvents(50));
  }, []);

  const handleAssign = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: '已指派' } : order
    ));
    showToast('指派成功');
  };

  const handleHandleException = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: '已处理', exceptionReason: undefined } : order
    ));
    showToast('异常处理成功');
  };

  const handleViewDetails = (order: Order) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      order,
    });
  };

  const handleReceiveAppointment = (order: Order) => {
    setReceiveAppointmentModal({ isOpen: true, order });
  };

  const handleNewOrder = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      order: null,
    });
  };

  const handleBatchAssign = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要指派的订单');
      return;
    }
    setBatchAssignModal({ isOpen: true });
  };

  const handleBatchAppointment = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要预约的订单');
      return;
    }
    setBatchAppointmentModal({ isOpen: true });
  };

  const handleVoid = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要作废的订单');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: '订单作废确认',
      message: `确定要作废选中的 ${selectedIds.length} 条订单吗？作废后数据将不可恢复。`,
      onConfirm: () => {
        setOrders(prev => prev.filter(order => !selectedIds.includes(order.id)));
        showToast('订单已成功作废');
        setSelectedIds([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const showToast = (message: string) => {
    setToast({ isVisible: true, message });
  };

  const selectedOrders = orders.filter(o => selectedIds.includes(o.id));

  return (
    <div className="flex flex-col h-screen bg-[#F2F3F5] font-sans overflow-hidden">
      <TopNav currentPage={currentPage} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        
        <main className="flex-1 flex flex-col overflow-y-auto px-6 py-5 relative">
          <div className="max-w-[1920px] mx-auto w-full flex flex-col min-h-full">
            {currentPage === 'dashboard' ? (
              <>
                <div className="flex flex-col flex-1 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Filters 
                    onSearch={(filters) => showToast(`查询成功: ${filters.orderNo || '全部订单'}`)}
                    onReset={() => showToast('已重置查询条件')}
                  />
                  <Actions 
                    onNewOrder={handleNewOrder} 
                    onBatchAssign={handleBatchAssign}
                    onBatchAppointment={handleBatchAppointment}
                    onVoid={handleVoid}
                  />
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <OrderTable 
                      orders={orders} 
                      selectedIds={selectedIds}
                      onSelectChange={setSelectedIds}
                      onAssign={handleAssign}
                      onHandleException={handleHandleException}
                      onViewDetails={handleViewDetails}
                      onReceiveAppointment={handleReceiveAppointment}
                    />
                  </div>
                  <Pagination />
                </div>
              </>
            ) : currentPage === 'stowage' ? (
              <StowageManagement 
                orders={orders} 
                onAssignToPlan={() => {}} 
                onViewDetails={handleViewDetails}
              />
            ) : currentPage === 'appointment' ? (
              <AppointmentManagement appointments={appointments} />
            ) : currentPage === 'track' ? (
              <TrackMonitoring records={trackRecords} />
            ) : currentPage === 'workorder' ? (
              <WorkOrderProcessing orders={workOrders} />
            ) : (
              <ExceptionEventManagement events={exceptionEvents} />
            )}
          </div>
          
          <footer className="h-[40px] flex items-center justify-center text-xs text-[#86909C] mt-4 shrink-0">
            Copyright © 2023 智慧物流TMS All Rights Reserved. Version 1.0.0
          </footer>
        </main>
      </div>

      <OrderModal 
        isOpen={modalState.isOpen} 
        mode={modalState.mode}
        order={modalState.order}
        onClose={closeModal} 
      />

      <BatchAssignModal
        isOpen={batchAssignModal.isOpen}
        onClose={() => setBatchAssignModal({ isOpen: false })}
        orders={selectedOrders}
        onConfirm={() => {
          setOrders(prev => prev.map(order => 
            selectedIds.includes(order.id) ? { ...order, status: '已指派' } : order
          ));
          showToast(`成功批量指派 ${selectedIds.length} 条订单`);
          setSelectedIds([]);
          setBatchAssignModal({ isOpen: false });
        }}
      />

      <BatchAppointmentModal
        isOpen={batchAppointmentModal.isOpen}
        onClose={() => setBatchAppointmentModal({ isOpen: false })}
        orders={selectedOrders}
        onConfirm={() => {
          showToast(`成功为 ${selectedIds.length} 条订单发起预约`);
          setSelectedIds([]);
          setBatchAppointmentModal({ isOpen: false });
        }}
      />

      <ReceiveAppointmentModal
        isOpen={receiveAppointmentModal.isOpen}
        order={receiveAppointmentModal.order}
        onClose={() => setReceiveAppointmentModal({ isOpen: false, order: null })}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
      
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}
