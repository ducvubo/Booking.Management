import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Input, Space, Tag, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { categoryService, type Category } from '@/services/categoryService';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.tree();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await categoryService.disable(id);
      fetchCategories();
    } catch (error) {
      console.error('Disable category error:', error);
    }
  };

  const handleEnable = async (id: string) => {
    try {
      await categoryService.enable(id);
      fetchCategories();
    } catch (error) {
      console.error('Enable category error:', error);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => icon ? <span>{icon}</span> : '-',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
              onClick={() => navigate(`/categories/update?id=${record.id}`)}
            />
          </Tooltip>
          {record.status === 1 ? (
            <Popconfirm
              title="Ngưng hoạt động danh mục?"
              description="Tất cả danh mục con phải ngưng trước"
              onConfirm={() => handleDisable(record.id)}
              okText="Ngưng"
              cancelText="Hủy"
            >
              <Tooltip title="Ngưng">
                <Button type="text" danger icon={<StopOutlined />} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Kích hoạt lại danh mục?"
              onConfirm={() => handleEnable(record.id)}
              okText="Kích hoạt"
              cancelText="Hủy"
            >
              <Tooltip title="Kích hoạt">
                <Button type="text" style={{ color: 'green' }} icon={<CheckCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Filter by keyword
  const filteredCategories = categories.filter(
    (cat) =>
      cat.code?.toLowerCase().includes(keyword.toLowerCase()) ||
      cat.name?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold m-0">Quản Lý Danh Mục Dịch Vụ</h1>
          <Space>
            <Input
              placeholder="Tìm theo mã, tên..."
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/categories/add')}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={false}
          expandable={{
            childrenColumnName: 'children',
            defaultExpandAllRows: true,
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default CategoryManagement;
