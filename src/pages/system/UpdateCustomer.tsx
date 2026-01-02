import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col } from 'antd';
import { userService, type UpdateUserRequest, type User } from '@/services/userService';

/**
 * Update Customer Page
 * userType = 2 (Customer) - no policy needed
 */
const UpdateCustomer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      loadUser();
    } else {
      navigate('/customers');
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoadingUser(true);
      const userData = await userService.getById(userId!);
      setUser(userData);
      form.setFieldsValue({
        email: userData.email,
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (error) {
      console.error('Error loading user:', error);
      navigate('/customers');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: UpdateUserRequest = {
        id: userId!,
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
      };

      setLoading(true);
      await userService.update(request);
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="text-center py-8">Đang tải thông tin...</div>
      </Card>
    );
  }

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Chỉnh Sửa Khách Hàng: {user?.username}</h1>
          <Space>
            <Button onClick={() => navigate('/customers')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Cập Nhật
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Tên đăng nhập" style={{ marginBottom: '12px' }}>
                <Input value={user?.username} disabled />
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
                label="Họ tên"
                name="fullName"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Họ và tên" />
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

          <Row gutter={16}>
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

export default UpdateCustomer;
