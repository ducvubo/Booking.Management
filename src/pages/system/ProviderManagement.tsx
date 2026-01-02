import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, Card, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { userService, type User } from '@/services/userService';

/**
 * Provider Management
 * Quản lý nhà cung cấp dịch vụ - userType = 3
 * Không cần Policy/Gán quyền
 */
const ProviderManagement = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.list({
        keyword,
        userType: 2, // SERVICE_PROVIDER=2 (from UserType enum)
        page: page - 1,
        size: pageSize,
      });
      setUsers(result.items || []);
      setTotal(result.totalElements);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleDisable = async (id: string) => {
    try {
      await userService.disable(id);
      fetchUsers();
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const handleEnable = async (id: string) => {
    try {
      await userService.enable(id);
      fetchUsers();
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Tỉnh/Thành',
      dataIndex: 'province',
      key: 'province',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number, record: User) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {record.statusName || (status === 1 ? 'Hoạt động' : 'Ngưng')}
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
          {record.status === 1 ? (
            <Popconfirm
              title="Ngưng hoạt động?"
              description="Nhà cung cấp sẽ không thể nhận booking"
              onConfirm={() => handleDisable(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Tooltip title="Ngưng hoạt động">
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

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold m-0">Quản Lý Nhà Cung Cấp</h1>
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          size="small"
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhà cung cấp`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default ProviderManagement;
