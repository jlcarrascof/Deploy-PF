import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import HotelsDashboard from "../HotelsDashboard/hotelDashboard"
import UserDashboardrom from "../UserDashboard/UserDashboard2"
import UserProfile from '../../userProfile/UserProfile';

import { Layout, Menu, Button } from 'antd';

const { Header, Sider, Content } = Layout;

const SideBar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>('1'); 
  
    useEffect(() => {
      const storedKey = localStorage.getItem('selectedKey');
      if (storedKey) {
        setSelectedKey(storedKey);
      }
    }, []);
  
    const handleMenuSelect = ({ key }: { key: string }) => {
      setSelectedKey(key);
      localStorage.setItem('selectedKey', key);
    };
  

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={handleMenuSelect}
          items={[
            {
              key: '1',
              icon: <HddOutlined />,
              label: 'Admin Hotels',
            },
            {
              key: '2',
              icon: <UsergroupDeleteOutlined />,
              label: 'Admin Users',
            },
            {
              key: '3',
              icon: <SettingOutlined />,
              label: 'Profile Settings',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {selectedKey === "1" ? <HotelsDashboard/> : 
          selectedKey === "2" ? <UserDashboardrom /> :
          <UserProfile />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;