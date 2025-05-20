import React from 'react';
import './Header.css';

const Header = () => {
    const title = 'My To Do List';

    return (
        <header className="modern-header">
            <div className="accent-bar"></div>
            <div className="header-content">
                <span className="header-icon">📝</span>
                <h1>{title}</h1>
            </div>
        </header>
    );
};

export default Header;
