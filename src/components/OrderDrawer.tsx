import React from 'react';
import { Drawer, Form, Input, Select, DatePicker, Table, Button, Row, Col, Divider, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Order } from '../types';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'view';
  order?: Order | null;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose, mode, order }) => {
  const isView = mode === 'view';
  const [form] = Form.useForm();

  const cargoColumns = [
    { title: '商品名称', dataIndex: 'productName', key: 'productName', render: (text: string) => <Input defaultValue={text} disabled={isView} /> },
    { title: '货物数量', dataIndex: 'quantity', key: 'quantity', render: (val: number) => <Input type="number" defaultValue={val} disabled={isView} /> },
    { title: '货物单位', dataIndex: 'unit', key: 'unit', render: (val: string) => (
      <Select defaultValue={val} disabled={isView} style={{ width: '100%' }} options={[
        { value: '箱', label: '箱' },
        { value: '托', label: '托' }
      ]} />
    )},
    { title: '操作', key: 'action', render: (_: any, record: any) => !isView && <Button danger icon={<DeleteOutlined />} /> }
  ];

  return (
    <Drawer
      title={isView ? '订单详情' : '新增订单'}
      width={720}
      onClose={onClose}
      open={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          {!isView && <Button type="primary" onClick={onClose}>保存</Button>}
        </Space>
      }
    >
      <Form form={form} layout="vertical" disabled={isView}>
        <Divider orientation="left">基础信息</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="订单号"><Input defaultValue={order?.orderNo} disabled /></Form.Item></Col>
          <Col span={12}><Form.Item label="订单来源"><Input defaultValue="新建" disabled /></Form.Item></Col>
          <Col span={12}><Form.Item label="下单时间"><DatePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={12}><Form.Item label="账单结算时间"><DatePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
        </Row>

        <Divider orientation="left">发货方信息</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="合同名称"><Select showSearch placeholder="搜索合同" /></Form.Item></Col>
          <Col span={12}><Form.Item label="线路名称"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="品项"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="运输类型"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="发货方姓名"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="发货方联系方式"><Input /></Form.Item></Col>
          <Col span={24}><Form.Item label="发货方地址"><Input.TextArea /></Form.Item></Col>
          <Col span={12}><Form.Item label="要求最晚发货时间"><DatePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={12}><Form.Item label="预估里程数"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="预估行驶时间"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="预计到货时间"><DatePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={12}><Form.Item label="结费货量"><Input /></Form.Item></Col>
        </Row>

        <Divider orientation="left">收货方信息</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="收货方姓名"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="收货方联系方式"><Input /></Form.Item></Col>
          <Col span={24}><Form.Item label="收货方地址"><Input.TextArea /></Form.Item></Col>
        </Row>

        <Divider orientation="left">货物信息</Divider>
        <Table columns={cargoColumns} dataSource={[{ key: '1', productName: '示例', quantity: 1, unit: '箱' }]} pagination={false} />
        {!isView && <Button icon={<PlusOutlined />} style={{ marginTop: 16 }}>新增货物</Button>}

        <Divider orientation="left">费用信息</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="运输费"><Input disabled /></Form.Item></Col>
          <Col span={12}><Form.Item label="装车费"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="卸车费"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="费用合计"><Input disabled /></Form.Item></Col>
          <Col span={24}><Form.Item label="结算方式"><Select options={[
            { value: '现结', label: '现结' },
            { value: '月结', label: '月结' },
            { value: '季度结算', label: '季度结算' }
          ]} /></Form.Item></Col>
        </Row>
      </Form>
    </Drawer>
  );
};
