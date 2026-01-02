import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Card, Space, Row, Col, InputNumber, Input } from 'antd';
import { providerServiceApi, type ProviderServiceRequest, type ProviderServiceItem } from '@/services/providerServiceApi';

const { TextArea } = Input;

/**
 * Update Provider Service
 * Cập nhật thông tin dịch vụ của nhà cung cấp
 */
const UpdateProviderService = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('id');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [service, setService] = useState<ProviderServiceItem | null>(null);

  useEffect(() => {
    if (serviceId) {
      loadData();
    } else {
      navigate('/provider-services');
    }
  }, [serviceId]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const data = await providerServiceApi.getById(serviceId!);
      setService(data);
      form.setFieldsValue({
        priceFrom: data.priceFrom,
        priceTo: data.priceTo,
        description: data.description,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/provider-services');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: ProviderServiceRequest = {
        providerId: service!.providerId,
        categoryId: service!.categoryId,
        priceFrom: values.priceFrom,
        priceTo: values.priceTo,
        description: values.description,
      };

      setLoading(true);
      await providerServiceApi.update(serviceId!, request);
      navigate('/provider-services');
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
          <h1 className="text-xl font-bold m-0">
            Cập Nhật: {service?.providerName} - {service?.categoryName}
          </h1>
          <Space>
            <Button onClick={() => navigate('/provider-services')}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Cập Nhật
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Nhà Cung Cấp" style={{ marginBottom: '12px' }}>
                <Input value={service?.providerName} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Loại Dịch Vụ" style={{ marginBottom: '12px' }}>
                <Input value={`${service?.categoryCode} - ${service?.categoryName}`} disabled />
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

export default UpdateProviderService;
