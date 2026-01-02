import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Space, Row, Col, Select, InputNumber, Input } from 'antd';
import { providerServiceApi, type ProviderServiceRequest } from '@/services/providerServiceApi';
import { userService, type User } from '@/services/userService';
import { categoryService, type Category } from '@/services/categoryService';

const { TextArea } = Input;

/**
 * Add Provider Service
 * Đăng ký dịch vụ cho nhà cung cấp
 */
const AddProviderService = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load providers (userType=2: SERVICE_PROVIDER)
      const providersResult = await userService.list({ userType: 2, size: 1000 });
      setProviders((providersResult.items || []).filter(p => p.status === 1));

      // Load categories
      const categoriesResult = await categoryService.list();
      setCategories(categoriesResult.filter(c => c.status === 1));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: ProviderServiceRequest = {
        providerId: values.providerId,
        categoryId: values.categoryId,
        priceFrom: values.priceFrom,
        priceTo: values.priceTo,
        description: values.description,
      };

      setLoading(true);
      await providerServiceApi.register(request);
      navigate('/provider-services');
    } catch (error) {
      console.error('Error registering service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Đăng Ký Dịch Vụ Cho Nhà Cung Cấp</h1>
          <Space>
            <Button onClick={() => navigate('/provider-services')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Đăng Ký
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Nhà Cung Cấp"
                name="providerId"
                rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
                style={{ marginBottom: '12px' }}
              >
                <Select
                  placeholder="Chọn nhà cung cấp"
                  showSearch
                  optionFilterProp="children"
                >
                  {providers.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.fullName || p.username}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Loại Dịch Vụ"
                name="categoryId"
                rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
                style={{ marginBottom: '12px' }}
              >
                <Select
                  placeholder="Chọn loại dịch vụ"
                  showSearch
                  optionFilterProp="children"
                >
                  {categories.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Giá Từ (VNĐ)"
                name="priceFrom"
                style={{ marginBottom: '12px' }}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                  placeholder="VD: 100,000"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Giá Đến (VNĐ)"
                name="priceTo"
                style={{ marginBottom: '12px' }}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                  placeholder="VD: 500,000"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô Tả Dịch Vụ"
            name="description"
            style={{ marginBottom: '12px' }}
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết về dịch vụ này..." />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProviderService;
