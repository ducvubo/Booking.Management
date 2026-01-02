import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col, message } from 'antd';
import serviceProviderService from '@/services/serviceProviderService';
import type { RegisterProviderWithAccountRequest } from '@/services/serviceProviderService';

/**
 * Add Service Provider Page
 * Creates User account + ServiceProvider in one transaction
 */
const AddServiceProvider = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: RegisterProviderWithAccountRequest = {
        username: values.username,
        password: values.password,
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        businessName: values.businessName || values.fullName,
        description: values.description,
      };

      setLoading(true);
      const response = await serviceProviderService.registerWithAccount(request);
      
      if (response.data.success) {
        message.success('Thêm nhà cung cấp thành công!');
        navigate('/service-providers');
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error: unknown) {
      console.error('Error creating provider:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      message.error(axiosError.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Thêm Nhà Cung Cấp Mới</h1>
          <Space>
            <Button onClick={() => navigate('/service-providers')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Tạo Mới
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
          <h3 className="text-base font-semibold mb-2">Thông tin tài khoản</h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                ]}
                style={{ marginBottom: '12px' }}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <h3 className="text-base font-semibold mb-2 mt-2">Thông tin nhà cung cấp</h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên doanh nghiệp (nếu có)"
                name="businessName"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Tên cửa hàng / doanh nghiệp" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                style={{ marginBottom: '12px' }}
              >
                <Input.TextArea rows={3} placeholder="Mô tả về nhà cung cấp..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddServiceProvider;
