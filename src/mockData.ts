import { Order, Appointment, TrackRecord, WorkOrder } from './types';

export const generateMockOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['待处理', '待配载', '待配载', '待配载', '已指派', '运输中', '异常', '已完成'];
  const receiveStatuses: Order['receiveStatus'][] = ['未开始结算', '待结算', '结算中', '已结算'];
  const payStatuses: Order['payStatus'][] = ['未开始结算', '待结算', '结算中', '已结算'];

  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[i % statuses.length];
    return {
      id: `order-${i}`,
      orderNo: `DO202310241030${String(i).padStart(5, '0')}`,
      customerName: i % 2 === 0 ? '农夫山泉股份有限公司' : '百事可乐（中国）有限公司',
      routeName: i % 2 === 0 ? '杭州-上海' : '广州-深圳',
      receiveAddress: '上海市浦东新区张江高科技园区',
      sendAddress: '浙江省杭州市西湖区文一西路',
      transportType: '4.2m厢式',
      goodsCategory: '饮料/瓶坯',
      settleVolume: '5t',
      senderContact: '张三 13800138000',
      receiver: '李四',
      receiverContact: '13900139000',
      requireSendTime: '2023-10-25',
      status,
      receiveStatus: receiveStatuses[i % receiveStatuses.length],
      payStatus: payStatuses[i % payStatuses.length],
      billSettleTime: '2023-11-25',
      exceptionReason: status === '异常' ? '车辆抛锚，预计延迟2小时' : undefined,
    };
  });
};

export const generateMockAppointments = (count: number): Appointment[] => {
  const statuses: Appointment['status'][] = ['预约待处理', '预约成功', '预约失败', '已取消', '审核中'];
  const senders = ['百事可乐', '农夫山泉', '顶津'];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `APT-${1000 + i}`,
      orderNo: `DO202405${21000 + i}`,
      senderName: senders[Math.floor(Math.random() * senders.length)],
      senderContact: '13800138000',
      receiverName: `客户${String.fromCharCode(65 + (i % 26))}`,
      receiverContact: '13900139000',
      expectedArrivalTime: `2024-05-${22 + (i % 5)} 10:00:00`,
      vehicleType: i % 2 === 0 ? '4.2m厢式' : '9.6m高栏',
      receiverAddress: `广东省深圳市南山区科技园${i + 1}栋`,
      status,
      initiator: '张三',
      initiateTime: `2024-05-21 09:${10 + (i % 50)}:00`,
      operateTime: status === '预约待处理' ? '-' : `2024-05-21 10:${10 + (i % 50)}:00`,
    };
  });
};

export const generateMockTrackRecords = (count: number): TrackRecord[] => {
  const statuses: TrackRecord['status'][] = ['运输中', '已结束'];
  const trackStatuses: TrackRecord['trackStatus'][] = ['正常', '异常L1', '异常L2', '异常L3', '异常L4', '符合要求', '不符合要求'];
  const processStatuses: TrackRecord['processStatus'][] = ['无须处理', '待处理', '已处理'];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const trackStatus = trackStatuses[Math.floor(Math.random() * trackStatuses.length)];
    return {
      id: `TR-${1000 + i}`,
      dispatchNo: `DP202405${21000 + i}`,
      supplier: ['顺丰速运', '京东物流', '中通快运'][Math.floor(Math.random() * 3)],
      vehicleType: i % 2 === 0 ? '4.2m厢式' : '9.6m高栏',
      plateNo: `粤B${12345 + i}`,
      driverName: `司机${String.fromCharCode(65 + (i % 26))}`,
      driverContact: '13800138000',
      status,
      trackStatus,
      departureTime: `2024-05-21 09:${10 + (i % 50)}:00`,
      arrivalTime: status === '已结束' ? `2024-05-22 10:${10 + (i % 50)}:00` : '-',
      processStatus: processStatuses[Math.floor(Math.random() * processStatuses.length)],
      processMethod: ['站内通知', '短信通知', '智能客服', '人工电话:未接通', '人工电话:已接通'][Math.floor(Math.random() * 5)],
      warningLevel: ['低', '中', '高'][Math.floor(Math.random() * 3)],
      lostDuration: trackStatus.includes('异常') ? `${Math.floor(Math.random() * 5) + 1}小时` : '-',
      estimatedDistance: `${Math.floor(Math.random() * 500) + 50}km`,
    };
  });
};

export const generateMockWorkOrders = (count: number): WorkOrder[] => {
  const statuses: WorkOrder['status'][] = ['运输中', '已结束'];
  const processStatuses: WorkOrder['processStatus'][] = ['待处理', '已处理'];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const processStatus = processStatuses[Math.floor(Math.random() * processStatuses.length)];
    return {
      id: `WO-${1000 + i}`,
      dispatchNo: `DP202405${21000 + i}`,
      supplier: ['顺丰速运', '京东物流', '中通快运'][Math.floor(Math.random() * 3)],
      vehicleType: i % 2 === 0 ? '4.2m厢式' : '9.6m高栏',
      plateNo: `粤B${12345 + i}`,
      driverName: `司机${String.fromCharCode(65 + (i % 26))}`,
      driverContact: '13800138000',
      status,
      trackStatus: ['正常', '异常L1', '异常L2', '异常L3', '异常L4'][Math.floor(Math.random() * 5)],
      departureTime: `2024-05-21 09:${10 + (i % 50)}:00`,
      processStatus,
      exceptionLevel: `L${Math.floor(Math.random() * 4) + 1}`,
      estimatedDistance: `${Math.floor(Math.random() * 500) + 50}km`,
      lostDuration: `${Math.floor(Math.random() * 5) + 1}小时`,
      processor: processStatus === '已处理' ? '张三' : '-',
      processResult: processStatus === '已处理' ? ['已接通', '未接通'][Math.floor(Math.random() * 2)] : '-',
      processTime: processStatus === '已处理' ? `2024-05-21 10:${10 + (i % 50)}:00` : '-',
    };
  });
};

import { ExceptionEvent } from './types';

export const generateMockExceptionEvents = (count: number): ExceptionEvent[] => {
  const eventTypes = ['装车事件', '卸车费', '装车小费', '卸车小费', '盘车费', '回单丢失', '货损'];
  const statuses: ExceptionEvent['status'][] = ['待调度审核', '待财务审核', '审核驳回', '待上游审核', '上游审核驳回', '待司机确认', '事件完结'];
  const incomeTypes = ['装车费', '卸车费', '装车小费', '卸车小费', '压车费', '派车费', '回单扣除', '货损扣除', '轨迹丢失扣除'];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      id: `EE-${1000 + i}`,
      eventNo: `EX202405${21000 + i}`,
      eventType,
      description: `发生${eventType}，需要额外处理费用。`,
      dispatchNo: `DP202405${21000 + i}`,
      relatedOrders: [`DO202405${21000 + i}`, `DO202405${21001 + i}`],
      incomeAmount: Math.floor(Math.random() * 500) + 50,
      incomeType: incomeTypes[Math.floor(Math.random() * incomeTypes.length)],
      costAmount: Math.floor(Math.random() * 400) + 30,
      costType: incomeTypes[Math.floor(Math.random() * incomeTypes.length)],
      weight: Math.floor(Math.random() * 10) + 1,
      volume: Math.floor(Math.random() * 20) + 5,
      allocationMethod: i % 2 === 0 ? '平均分摊' : '按订单手动分摊',
      shipper: ['顺丰速运', '京东物流', '中通快运'][Math.floor(Math.random() * 3)],
      driverName: `司机${String.fromCharCode(65 + (i % 26))}`,
      driverContact: '13800138000',
      attachments: i % 2 === 0 ? ['receipt.jpg', 'photo.png'] : [],
      status,
      reporter: '操作员张三',
      reportTime: `2024-05-21 09:${10 + (i % 50)}:00`,
      auditor: status !== '待调度审核' ? '审核员李四' : undefined,
      auditLogs: status !== '待调度审核' ? [
        {
          auditor: '审核员李四',
          auditTime: `2024-05-21 10:${10 + (i % 50)}:00`,
          result: status.includes('驳回') ? '驳回' : '通过',
          remark: status.includes('驳回') ? '金额不符，请重新核对' : '同意',
        }
      ] : [],
    };
  });
};

