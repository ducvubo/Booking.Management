import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tag, Input, Modal, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  CloseOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import serviceProviderService from '@/services/serviceProviderService';
import type { ServiceProvider } from '@/services/serviceProviderService';

const ServiceProviderManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await serviceProviderService.getList(page, size);
      if (response.data.success) {
        const pageData = response.data.data; // Backend uses 'data' not 'result'
        setData(pageData.content);
        setPagination({
          current: pageData.page,
          pageSize: pageData.size,
          total: pageData.totalElements,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhà cung cấp này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await serviceProviderService.delete(id);
          if (response.data.success) {
            message.success('Xóa thành công');
            fetchData(pagination.current, pagination.pageSize);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          message.error('Lỗi khi xóa');
        }
      },
    });
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await serviceProviderService.approve(id);
      if (response.data.success) {
        message.success('Duyệt thành công');
        fetchData(pagination.current, pagination.pageSize);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Lỗi khi duyệt');
    }
  };

  const handleReject = async (id: string) => {
    Modal.confirm({
      title: 'Từ chối nhà cung cấp',
      content: 'Bạn có chắc muốn từ chối nhà cung cấp này?',
      okText: 'Từ chối',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await serviceProviderService.reject(id);
          if (response.data.success) {
            message.success('Đã từ chối');
            fetchData(pagination.current, pagination.pageSize);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          message.error('Lỗi khi từ chối');
        }
      },
    });
  };

  const getStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="green">Hoạt động</Tag>;
      case 0:
        return <Tag color="red">Ngừng hoạt động</Tag>;
      case 2:
        return <Tag color="orange">Chờ duyệt</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: ColumnsType<ServiceProvider> = [
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'businessName',
      key: 'businessName',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (_, record) => 
        (record.businessName?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.phone?.includes(searchText)) ?? false,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating, record) => rating ? `${rating} (${record.totalReviews || 0})` : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/service-providers/update/${record.id}`)}
            />
          </Tooltip>
          {record.status === 2 && (
            <>
              <Tooltip title="Duyệt">
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  style={{ color: 'green' }}
                  onClick={() => handleApprove(record.id)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  style={{ color: 'orange' }}
                  onClick={() => handleReject(record.id)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Xóa">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/service-providers/add')}
        >
          Thêm nhà cung cấp
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} nhà cung cấp`,
          onChange: (page, pageSize) => fetchData(page, pageSize),
        }}
      />
    </div>
  );
};

export default ServiceProviderManagement;
