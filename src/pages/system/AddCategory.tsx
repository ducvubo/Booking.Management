import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Row, Col, TreeSelect, InputNumber } from 'antd';
import { categoryService, type CreateCategoryRequest, type Category } from '@/services/categoryService';

const { TextArea } = Input;

// Helper to remove Vietnamese diacritics
const removeDiacritics = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Convert flat categories to tree data for TreeSelect
const buildTreeData = (categories: Category[]): any[] => {
  return categories.map((cat) => ({
    value: cat.id,
    title: cat.name,
    children: cat.children && cat.children.length > 0 ? buildTreeData(cat.children) : undefined,
    disabled: cat.status !== 1,
  }));
};

const AddCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.tree();
      setTreeData(buildTreeData(data));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const request: CreateCategoryRequest = {
        code: values.code,
        name: values.name,
        description: values.description,
        icon: values.icon,
        parentId: values.parentId,
        sortOrder: values.sortOrder || 0,
      };

      setLoading(true);
      await categoryService.create(request);
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Tạo Danh Mục Mới</h1>
          <Space>
            <Button onClick={() => navigate('/categories')}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              Tạo Mới
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mã Danh Mục"
                name="code"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã danh mục' },
                  { pattern: /^[A-Z0-9_]+$/, message: 'Mã phải viết hoa, không dấu (VD: HOME_REPAIR)' },
                ]}
                style={{ marginBottom: '12px' }}
                normalize={(value) => removeDiacritics(value || '').toUpperCase().replace(/\s/g, '')}
              >
                <Input placeholder="VD: HOME_REPAIR, TAXI" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên Danh Mục"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="VD: Sửa nhà, Đặt taxi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Danh Mục Cha"
                name="parentId"
                style={{ marginBottom: '12px' }}
              >
                <TreeSelect
                  placeholder="Chọn danh mục cha (nếu có)"
                  allowClear
                  showSearch
                  treeData={treeData}
                  treeLine={{ showLeafIcon: false }}
                  filterTreeNode={(input, node) =>
                    (node?.title as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Thứ Tự"
                name="sortOrder"
                style={{ marginBottom: '12px' }}
              >
                <InputNumber 
                  min={0} 
                  placeholder="0" 
                  style={{ width: '100%' }} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Icon"
                name="icon"
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Icon name hoặc emoji (VD: 🏠, 🚕)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô Tả"
            name="description"
            style={{ marginBottom: '12px' }}
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết về danh mục" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategory;
