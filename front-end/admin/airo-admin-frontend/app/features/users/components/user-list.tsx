import { FC } from 'react';

import User from '../types/user';
import styles from './user-list.module.css';

interface UserListProps {
    users: User[];
    onDelete: (ud: string) => void;
}

const UserList: FC<UserListProps> = ({ users, onDelete }) => {
    const handleDelete = (uid: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            onDelete(uid);
        }
    };

    return (
        <div className={styles.userList}>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.uid} className={styles.userItem}>
                        <strong>{user.email}</strong>
                        <p>Email: {user.email}</p>
                        <button onClick={() => handleDelete(user.uid)} className={styles.deleteButton}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
