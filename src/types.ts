export type OrderStatus = 
  | '待处理' 
  | '待配载'
  | '已指派' 
  | '预约待处理' 
  | '预约成功' 
  | '待派车' 
  | '待接单' 
  | '已接单' 
  | '已到达装货点' 
  | '待装车' 
  | '已装车' 
  | '运输中' 
  | '待卸货' 
  | '待签单' 
  | '回单待审核' 
  | '待结算' 
  | '已完成' 
  | '异常' 
  | '已处理';

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  routeName: string;
  receiveAddress: string;
  sendAddress: string;
  transportType: string;
  goodsCategory: string;
  settleVolume: string;
  senderContact: string;
  receiver: string;
  receiverContact: string;
  requireSendTime: string;
  status: OrderStatus;
  receiveStatus: '未开始结算' | '待结算' | '结算中' | '已结算';
  payStatus: '未开始结算' | '待结算' | '结算中' | '已结算';
  billSettleTime: string;
  exceptionReason?: string;
}

export interface StowagePlan {
  id: string;
  planNo: string;
  vehicleType: string;
  orders: Order[];
  totalWeight: number;
  totalVolume: number;
  stowageRate: number;
  status: '待发车' | '已发车' | '已完成';
  strategy?: string;
  createTime?: string;
  operator?: string;
}

export interface Appointment {
  id: string;
  orderNo: string;
  senderName: string;
  senderContact: string;
  receiverName: string;
  receiverContact: string;
  expectedArrivalTime: string;
  vehicleType: string;
  receiverAddress: string;
  status: '预约待处理' | '预约成功' | '预约失败' | '已取消' | '审核中';
  initiator: string;
  initiateTime: string;
  operateTime: string;
}

export interface TrackRecord {
  id: string;
  dispatchNo: string;
  supplier: string;
  vehicleType: string;
  plateNo: string;
  driverName: string;
  driverContact: string;
  status: '运输中' | '已结束';
  trackStatus: '正常' | '异常L1' | '异常L2' | '异常L3' | '异常L4' | '符合要求' | '不符合要求';
  departureTime: string;
  arrivalTime: string;
  processStatus: '无须处理' | '待处理' | '已处理';
  processMethod: string;
  warningLevel: string;
  lostDuration: string;
  estimatedDistance: string;
}

export interface WorkOrder {
  id: string;
  dispatchNo: string;
  supplier: string;
  vehicleType: string;
  plateNo: string;
  driverName: string;
  driverContact: string;
  status: '运输中' | '已结束';
  trackStatus: string;
  departureTime: string;
  processStatus: '待处理' | '已处理';
  exceptionLevel: string;
  estimatedDistance: string;
  lostDuration: string;
  processor: string;
  processResult: string;
  processTime: string;
}

export interface AuditLog {
  auditor: string;
  auditTime: string;
  result: '通过' | '驳回';
  remark?: string;
}

export interface ExceptionEvent {
  id: string;
  eventNo: string;
  eventType: string;
  description: string;
  dispatchNo: string;
  relatedOrders: string[];
  incomeAmount: number;
  incomeType: string;
  costAmount: number;
  costType: string;
  weight: number;
  volume: number;
  allocationMethod: '平均分摊' | '按订单手动分摊';
  shipper: string;
  driverName: string;
  driverContact: string;
  attachments: string[];
  status: '待调度审核' | '待财务审核' | '审核驳回' | '待上游审核' | '上游审核驳回' | '待司机确认' | '事件完结';
  reporter: string;
  reportTime: string;
  auditor?: string;
  auditLogs: AuditLog[];
}

