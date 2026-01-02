import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tag, Card, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { providerServiceApi, type ProviderServiceItem } from '@/services/providerServiceApi';

/**
 * Provider Service Management
 * Quản lý dịch vụ đăng ký của nhà cung cấp
 */
const ProviderServiceManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProviderServiceItem[]>([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await providerServiceApi.list();
      setItems(data);
    } catch (error) {
      console.error('Error fetching provider services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await providerServiceApi.disable(id);
      fetchData();
    } catch (error) {
      console.error('Error disabling:', error);
    }
  };

  const handleEnable = async (id: string) => {
    try {
      await providerServiceApi.enable(id);
      fetchData();
    } catch (error) {
      console.error('Error enabling:', error);
    }
  };

  const columns: ColumnsType<ProviderServiceItem> = [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 200,
    },
    {
      title: 'Mã DV',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: 120,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 200,
    },
    {
      title: 'Giá từ',
      dataIndex: 'priceFrom',
      key: 'priceFrom',
      width: 120,
      align: 'right',
      render: (value) => value ? value.toLocaleString('vi-VN') + 'đ' : '-',
    },
    {
      title: 'Giá đến',
      dataIndex: 'priceTo',
      key: 'priceTo',
      width: 120,
      align: 'right',
      render: (value) => value ? value.toLocaleString('vi-VN') + 'đ' : '-',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Hoạt động' : 'Ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/provider-services/update?id=${record.id}`)}
            />
          </Tooltip>
          {record.status === 1 ? (
            <Popconfirm
              title="Ngưng hoạt động dịch vụ?"
              onConfirm={() => handleDisable(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Tooltip title="Ngưng">
                <Button type="text" danger icon={<StopOutlined />} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title="Kích hoạt">
              <Button
                type="text"
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleEnable(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Filter by keyword
  const filteredItems = items.filter(
    (item) =>
      item.providerName?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.categoryCode?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold m-0">Quản Lý Dịch Vụ Nhà Cung Cấp</h1>
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/provider-services/add')}>
              Đăng ký dịch vụ
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          loading={loading}
          size="small"
          scroll={{ x: 1100 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đăng ký`,
          }}
        />
      </Card>
    </div>
  );
};

export default ProviderServiceManagement;
