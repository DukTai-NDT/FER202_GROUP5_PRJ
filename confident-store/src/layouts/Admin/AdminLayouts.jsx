import React from 'react';
import AdminHeader from './AdminHeader';
import AdminSideBar from './AdminSideBar';
import AdminFooter from './AdminFooter';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSideBar />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ alignItems: 'flex-start' }}>
                    <div>
                        <AdminHeader />
                    </div>
                    <div style={{ padding: '20px', marginLeft: '250px' }}>
                        {children}
                    </div>
                </div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminLayout;
