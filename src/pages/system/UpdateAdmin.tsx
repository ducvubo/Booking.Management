import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col, Select } from 'antd';
import { userService, type UpdateUserRequest, type User } from '@/services/userService';
import { policyService, type Policy } from '@/services/policyService';

/**
 * Update Admin Page
 * userType = 1 (Admin) - with policy selection
 */
const UpdateAdmin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      loadData();
    } else {
      navigate('/admins');
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoadingUser(true);
      const [userData, policyResult] = await Promise.all([
        userService.getById(userId!),
        policyService.list({}),
      ]);

      setUser(userData);
      form.setFieldsValue({
        email: userData.email,
        fullName: userData.fullName || '',
        phone: userData.phone || '',
      });
      setSelectedPolicyIds(userData.policyIds || []);

      const policyList = Array.isArray(policyResult) ? policyResult : policyResult.items || [];
      setPolicies(policyList.filter(p => p.status === 1));
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/admins');
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
        policyIds: selectedPolicyIds,
      };

      setLoading(true);
      await userService.update(request);
      navigate('/admins');
    } catch (error) {
      console.error('Error updating admin:', error);
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
          <h1 className="text-xl font-bold m-0">Chỉnh Sửa Admin: {user?.username}</h1>
          <Space>
            <Button onClick={() => navigate('/admins')}>Hủy</Button>
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

export default UpdateAdmin;
