import React, { useState } from 'react';
import { Modal, Alert, Upload, Progress, Table, Button, Space } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({ isOpen, onClose }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ total: number, success: number, fail: number } | null>(null);
  const [errors, setErrors] = useState<any[]>([]);

  const handleUpload = (file: any) => {
    setUploading(true);
    setProgress(0);
    // Simulate upload and parsing
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setResult({ total: 150, success: 145, fail: 5 });
          setErrors([
            { key: '1', row: '第 5 行', field: '联系电话', reason: '手机号格式不正确', original: '13800138' },
            { key: '2', row: '第 12 行', field: '品项', reason: '缺少品项信息', original: '' }
          ]);
          return 100;
        }
        return p + 10;
      });
    }, 200);
    return false; // Prevent auto upload
  };

  return (
    <Modal title="批量导入" open={isOpen} onCancel={onClose} width={800} footer={null}>
      <Alert 
        type="info" 
        showIcon 
        message="操作指引" 
        description={
          <Space direction="vertical">
            <span>请先下载标准模板，按规范填写后上传。支持 .xlsx, .xls, .csv 格式，单次最多导入 1000 条。</span>
            <Button type="link" icon={<DownloadOutlined />}>下载标准模板</Button>
          </Space>
        } 
      />
      <Upload.Dragger 
        name="file" 
        multiple={false} 
        beforeUpload={handleUpload} 
        style={{ marginTop: 16, height: 160 }}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p className="ant-upload-hint">支持扩展名：.xls .xlsx .csv</p>
      </Upload.Dragger>

      {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
      
      {result && (
        <div style={{ marginTop: 16 }}>
          <p>共解析 {result.total} 条数据，成功 {result.success} 条，失败 <span style={{ color: '#FF4D4F' }}>{result.fail}</span> 条。</p>
          {errors.length > 0 && (
            <Table 
              size="small" 
              dataSource={errors} 
              columns={[
                { title: 'Excel 行号', dataIndex: 'row' },
                { title: '异常字段', dataIndex: 'field' },
                { title: '错误原因', dataIndex: 'reason' },
                { title: '原填报内容', dataIndex: 'original' }
              ]} 
              style={{ marginTop: 8 }}
            />
          )}
        </div>
      )}
    </Modal>
  );
};
