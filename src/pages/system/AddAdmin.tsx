import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col, Select } from 'antd';
import { userService, type CreateUserRequest } from '@/services/userService';
import { policyService, type Policy } from '@/services/policyService';

/**
 * Add Admin Page
 * userType = 1 (Admin) - fixed, with policy selection
 */
const AddAdmin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const result = await policyService.list({});
      const policyList = Array.isArray(result) ? result : result.items || [];
      setPolicies(policyList.filter(p => p.status === 1));
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: CreateUserRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        userType: 3, // ADMIN=3
        policyIds: selectedPolicyIds,
      };

      setLoading(true);
      await userService.create(request);
      navigate('/admins');
    } catch (error) {
      console.error('Error creating admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Thêm Admin Mới</h1>
          <Space>
            <Button onClick={() => navigate('/admins')}>Hủy</Button>
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
          </Row>

          <Form.Item
            label="Gán Tập Quyền"
            style={{ marginBottom: '12px' }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn tập quyền cho admin"
              value={selectedPolicyIds}
              onChange={setSelectedPolicyIds}
              optionFilterProp="children"
              showSearch
            >
              {policies.map((policy) => (
                <Select.Option key={policy.id} value={policy.id}>
                  {policy.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdmin;
