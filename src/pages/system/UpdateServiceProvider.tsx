import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col, Spin, message } from 'antd';
import serviceProviderService from '@/services/serviceProviderService';

/**
 * Update Service Provider Page
 */
const UpdateServiceProvider = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await serviceProviderService.getById(id);
        if (response.data.success) {
          form.setFieldsValue(response.data.data); // Use 'data' not 'result'
        }
      } catch (error) {
        console.error('Error loading provider:', error);
        message.error('Không tìm thấy nhà cung cấp');
        navigate('/service-providers');
      }
      setFetching(false);
    };
    fetchData();
  }, [id, form, navigate]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      const response = await serviceProviderService.update({
        id: id!,
        businessName: values.businessName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        description: values.description,
      });
      
      if (response.data.success) {
        message.success('Cập nhật thành công!');
        navigate('/service-providers');
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error: unknown) {
      console.error('Error updating provider:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      message.error(axiosError.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Cập Nhật Nhà Cung Cấp</h1>
          <Space>
            <Button onClick={() => navigate('/service-providers')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Cập Nhật
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên doanh nghiệp"
                name="businessName"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Tên doanh nghiệp / cửa hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả"
            name="description"
            style={{ marginBottom: '12px' }}
          >
            <Input.TextArea rows={3} placeholder="Mô tả về nhà cung cấp..." />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateServiceProvider;
