import { FC } from 'react';

import Bot from '../types/bot';
import BotItem from './bot-item';

import styles from './bot-list.module.css';

interface BotListProps {
    bots: Bot[];
    onDelete: (id: string) => void;
    onEdit: (bot: Bot) => void;
}

const BotList: FC<BotListProps> = ({ bots, onDelete, onEdit }) => {
    return (
        <div className={styles.botList}>
            <h2>Bot List</h2>
            <ul>
                {bots.map(bot => (
                    <BotItem
                        key={bot.id}
                        bot={bot}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </ul>
        </div>
    );
};

export default BotList;
