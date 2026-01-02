import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col } from 'antd';
import { userService, type CreateUserRequest } from '@/services/userService';

/**
 * Add Customer Page
 * userType = 2 (Customer) - fixed, no policy needed
 */
const AddCustomer = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: CreateUserRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        userType: 1, // CUSTOMER=1
      };

      setLoading(true);
      await userService.create(request);
      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Thêm Khách Hàng Mới</h1>
          <Space>
            <Button onClick={() => navigate('/customers')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Tạo Mới
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
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
          </Row>

          <Row gutter={16}>
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
            <Col xs={24} sm={12}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Họ và tên" />
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
        </Form>
      </Card>
    </div>
  );
};

export default AddCustomer;
