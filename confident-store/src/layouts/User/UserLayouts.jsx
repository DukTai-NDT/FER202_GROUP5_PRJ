import React from 'react';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const UserLayouts = ({ children }) => {
    return (
        <div>
            <div style={{display:'fixed'}}>
            <UserHeader/>
            </div>
            <main>
                {children}
            </main>
            <UserFooter/>
        </div>
    );
};

export default UserLayouts;