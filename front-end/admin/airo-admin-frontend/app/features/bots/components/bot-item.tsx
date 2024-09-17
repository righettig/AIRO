import { FC } from 'react';

import Bot from '../types/bot';

import styles from './bot-item.module.css';

interface BotItemProps {
    bot: Bot;
    onDelete: (id: string) => void;
    onEdit: (bot: Bot) => void;
}

const BotItem: FC<BotItemProps> = ({ bot, onDelete, onEdit }) => {
    return (
        <li className={styles.botItem}>
            <div className={styles.botDetails}>
                <strong>{bot.name}</strong>
                <p>{bot.price}</p>
            </div>
            <div className={styles.botActions}>
                <button onClick={() => onEdit(bot)}>Edit</button>
                <button onClick={() => onDelete(bot.id)}>Delete</button>
            </div>
        </li>
    );
};

export default BotItem;
