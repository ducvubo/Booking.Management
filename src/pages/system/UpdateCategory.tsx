import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
const buildTreeData = (categories: Category[], excludeId?: string): any[] => {
  return categories
    .filter((cat) => cat.id !== excludeId) // Exclude current category from parent options
    .map((cat) => ({
      value: cat.id,
      title: `${cat.code} - ${cat.name}`,
      children: cat.children && cat.children.length > 0 
        ? buildTreeData(cat.children, excludeId) 
        : undefined,
      disabled: cat.status !== 1,
    }));
};

const UpdateCategory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('id');
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    if (categoryId) {
      loadData();
    } else {
      navigate('/categories');
    }
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      
      // Load category and valid parents in parallel
      const [categoryData, parentsData] = await Promise.all([
        categoryService.getById(categoryId!),
        categoryService.getValidParents(categoryId!),
      ]);
      
      setCategory(categoryData);
      
      // Build tree from valid parents (already excludes self and descendants)
      const treeFromParents = parentsData
        .filter(c => c.status === 1)
        .map(cat => ({
          value: cat.id,
          title: cat.name,
        }));
      setTreeData(treeFromParents);
      
      form.setFieldsValue({
        code: categoryData.code,
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
        parentId: categoryData.parentId,
        sortOrder: categoryData.sortOrder,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/categories');
    } finally {
      setLoadingData(false);
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
        parentId: values.parentId || null,
        sortOrder: values.sortOrder || 0,
      };

      setLoading(true);
      await categoryService.update(categoryId!, request);
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="text-center py-8">Đang tải thông tin danh mục...</div>
      </Card>
    );
  }

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Chỉnh Sửa: {category?.name}</h1>
          <Space>
            <Button onClick={() => navigate('/categories')}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              Cập Nhật
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
                  { pattern: /^[A-Z0-9_]+$/, message: 'Mã phải viết hoa, không dấu' },
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
                help="Chỉ hiện danh mục hợp lệ (không phải con cháu)"
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

export default UpdateCategory;
