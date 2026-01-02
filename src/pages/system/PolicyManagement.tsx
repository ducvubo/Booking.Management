import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tag, Card, Popconfirm, message, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { policyService, type Policy } from '@/services/policyService';

const PolicyManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const result = await policyService.list({
        keyword,
        page: page - 1,
        size: pageSize,
      });
      // Backend returns array directly, not paginated
      if (Array.isArray(result)) {
        setPolicies(result);
        setTotal(result.length);
      } else {
        setPolicies(result.items || []);
        setTotal(result.totalElements);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchPolicies();
  };

  const handleDelete = async (id: string) => {
    try {
      await policyService.delete(id);
      message.success('Đã xóa tập quyền');
      fetchPolicies();
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  const columns: ColumnsType<Policy> = [
    {
      title: 'Tên tập quyền',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: 'Số quyền',
      key: 'policiesCount',
      width: 120,
      render: (_, record) => (
        <Tag color="blue">{record.policies?.length || 0} quyền</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number, record: Policy) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {record.statusName || (status === 1 ? 'Hoạt động' : 'Ngưng')}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
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
              onClick={() => navigate(`/policies/update?id=${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tập quyền?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold m-0">Quản Lý Tập Quyền</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/policies/add')}
          >
            Thêm mới
          </Button>
        </div>

        <div className="mb-4">
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={policies}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tập quyền`,
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

export default PolicyManagement;
