import { FC, useState, useEffect } from 'react';

import Bot from '../types/bot';

import styles from './bot-creator.module.css';

interface BotCreatorProps {
    onAdd: (bot: Bot) => void;
    onUpdate: (bot: Bot) => void;
    botToEdit?: Bot | null;
}

const BotCreator: FC<BotCreatorProps> = ({ onAdd, onUpdate, botToEdit }) => {
    const [botName, setBotName] = useState('');
    const [botPrice, setBotPrice] = useState(0);

    useEffect(() => {
        if (botToEdit) {
            setBotName(botToEdit.name);
            setBotPrice(botToEdit.price);
        }
    }, [botToEdit]);

    const handleSaveBot = () => {
        if (!botName || !botPrice) {
            return;
        }

        const bot: Bot = {
            id: botToEdit ? botToEdit.id : (Math.random() * 1000).toString(),
            name: botName,
            price: botPrice,
        };

        if (botToEdit) {
            onUpdate(bot);
        } else {
            onAdd(bot);
        }

        setBotName('');
        setBotPrice(0);
    };

    return (
        <div className={styles.botCreator}>
            <h2>{botToEdit ? 'Edit Bot' : 'Create New Bot'}</h2>
            <input
                type="text"
                placeholder="Bot Name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Bot Price"
                value={botPrice}
                onChange={(e) => setBotPrice(parseInt(e.target.value))}
            />
            <button onClick={handleSaveBot} disabled={!botName || !botPrice}>
                {botToEdit ? 'Update Bot' : 'Add Bot'}
            </button>
        </div>
    );
};

export default BotCreator;
