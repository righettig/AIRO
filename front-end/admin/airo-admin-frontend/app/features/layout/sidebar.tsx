import { FC } from 'react';

import styles from './sidebar.module.css';

interface SidebarProps {
    onLogout: () => void;
    onSelect: (view: 'events') => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onLogout, onSelect, isCollapsed, onToggle }) => {
    return (
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <button onClick={onToggle} className={styles.toggleButton}>
                {isCollapsed ? '>' : '<'}
            </button>
            <div className={styles.menu}>
                <button onClick={() => onSelect('events')}>Events</button>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
