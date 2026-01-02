import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import type { MenuProps } from 'antd';
import { authService } from '../services/authService';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  UserSwitchOutlined,
  ShopOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <span className="font-semibold">Bảng Điều Khiển</span>,
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: <span className="font-semibold">Quản Lý Người Dùng</span>,
      children: [
        {
          key: '/admins',
          icon: <UserSwitchOutlined />,
          label: 'Quản lý Admin',
        },
        {
          key: '/customers',
          icon: <UserOutlined />,
          label: 'Quản lý Khách hàng',
        },
        {
          key: '/providers',
          icon: <ShopOutlined />,
          label: 'Quản lý Nhà cung cấp',
        },
      ],
    },
    {
      key: '/policies',
      icon: <SafetyOutlined />,
      label: <span className="font-semibold">Quản Lý Tập Quyền</span>,
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: <span className="font-semibold">Danh Mục Dịch Vụ</span>,
    },
    {
      key: '/provider-services',
      icon: <ToolOutlined />,
      label: <span className="font-semibold">Dịch Vụ Nhà Cung Cấp</span>,
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: <span className="font-semibold">Quản Lý Đặt Lịch</span>,
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Get selected keys including parent menu for submenu items
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/admins')) return ['/admins'];
    if (path.startsWith('/customers')) return ['/customers'];
    if (path.startsWith('/providers')) return ['/providers'];
    if (path.startsWith('/provider-services')) return ['/provider-services'];
    if (path.startsWith('/policies')) return ['/policies'];
    if (path.startsWith('/categories')) return ['/categories'];
    if (path.startsWith('/bookings')) return ['/bookings'];
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/admins') || path.startsWith('/customers') || path.startsWith('/providers')) {
      return ['user-management'];
    }
    return [];
  };

  return (
    <AntLayout className="min-h-screen">
      <Sider
        width={250}
        collapsed={collapsed}
        collapsible
        trigger={null}
        style={{
          backgroundColor: '#ffffff',
          height: '100vh',
          position: 'fixed',
          left: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        theme="light"
      >
        <div className="h-14 flex items-center justify-center border-b border-gray-200">
          {!collapsed && <h2 className="text-lg font-bold m-0 text-blue-600">Booking</h2>}
        </div>
        <div className="menu-scroll-wrapper" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            items={menuItems}
            onClick={({ key }) => {
              if (key !== 'user-management') {
                navigate(key);
              }
            }}
            className="border-r-0"
            style={{ borderRight: 0 }}
          />
        </div>
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header className="flex items-center justify-between sticky top-0 z-50" style={{ backgroundColor: '#2e4baa', color: '#ffffff', height: '55px', lineHeight: '48px', padding: '0 24px' }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#ffffff', fontSize: '16px' }}
            />
            <div className="text-base font-semibold" style={{ color: '#ffffff' }}>Booking Management</div>
          </Space>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <span style={{ color: '#ffffff' }}>{user.username}</span>
              </Space>
            </Dropdown>
          )}
        </Header>
        <Content className="p-2 bg-white" style={{ minHeight: 'calc(100vh - 55px)' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
