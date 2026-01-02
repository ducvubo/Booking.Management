import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Checkbox, Space, Collapse, Row, Col } from 'antd';
import { policyService, type Policy, type UpdatePolicyRequest } from '@/services/policyService';
import { permissionService, type Permission } from '@/services/permissionService';

const { TextArea } = Input;

const UpdatePolicy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get('id');
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!policyId) {
      navigate('/policies');
      return;
    }

    const fetchData = async () => {
      try {
        const [policyData, permissionsData] = await Promise.all([
          policyService.getById(policyId),
          permissionService.list(),
        ]);
        
        setPolicy(policyData);
        setPermissions(permissionsData);
        setSelectedPermissions(policyData.policies || []);
        
        form.setFieldsValue({
          name: policyData.name,
          description: policyData.description,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/policies');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [policyId, navigate, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (selectedPermissions.length === 0) {
        return;
      }

      const data: UpdatePolicyRequest = {
        id: policyId!,
        name: values.name,
        description: values.description,
        policies: selectedPermissions,
      };
      
      setLoading(true);
      await policyService.update(data);
      navigate('/policies');
    } catch (error) {
      console.error('Error updating policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, code]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== code));
    }
  };

  const handleSelectAll = (codes: string[], checked: boolean) => {
    if (checked) {
      const newSelected = [...new Set([...selectedPermissions, ...codes])];
      setSelectedPermissions(newSelected);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => !codes.includes(p)));
    }
  };

  // Group permissions by group
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const group = perm.group || 'Khác';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (fetching) {
    return (
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="text-center py-8">Đang tải thông tin tập quyền...</div>
      </Card>
    );
  }

  return (
    <div>
      <Card styles={{ body: { padding: '16px' } }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold m-0">Chỉnh Sửa Tập Quyền: {policy?.name}</h1>
          <Space>
            <Button onClick={() => navigate('/policies')}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
              disabled={selectedPermissions.length === 0}
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
                label="Tên Tập Quyền"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên tập quyền' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Nhập tên tập quyền" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mô Tả"
                name="description"
                style={{ marginBottom: '12px' }}
              >
                <TextArea rows={1} placeholder="Nhập mô tả" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label="Danh Sách Quyền"
            required
            help={
              selectedPermissions.length > 0
                ? `Đã chọn ${selectedPermissions.length} quyền`
                : 'Vui lòng chọn ít nhất một quyền'
            }
            validateStatus={selectedPermissions.length === 0 ? 'error' : undefined}
          >
            <Collapse>
              {Object.entries(groupedPermissions).map(([group, perms]) => {
                const codes = perms.map((p) => p.code);
                const allSelected = codes.every((c) => selectedPermissions.includes(c));
                const someSelected = codes.some((c) => selectedPermissions.includes(c)) && !allSelected;
                
                return (
                  <Collapse.Panel
                    key={group}
                    header={
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={(e) => handleSelectAll(codes, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-medium">{group}</span>
                        <span className="text-gray-400 ml-2">
                          ({perms.filter((p) => selectedPermissions.includes(p.code)).length}/{perms.length})
                        </span>
                      </Checkbox>
                    }
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {perms.map((perm) => (
                        <Checkbox
                          key={perm.code}
                          checked={selectedPermissions.includes(perm.code)}
                          onChange={(e) => handlePermissionChange(perm.code, e.target.checked)}
                        >
                          {perm.name}
                        </Checkbox>
                      ))}
                    </div>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePolicy;
