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
    const [botHealth, setBotHealth] = useState(0);
    const [botAttack, setBotAttack] = useState(0);
    const [botDefense, setBotDefense] = useState(0);

    useEffect(() => {
        if (botToEdit) {
            setBotName(botToEdit.name);
            setBotPrice(botToEdit.price);
            setBotHealth(botToEdit.health);
            setBotAttack(botToEdit.attack);
            setBotDefense(botToEdit.defense);
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
            health: botHealth,
            attack: botAttack,
            defense: botDefense,
        };

        if (botToEdit) {
            onUpdate(bot);
        } else {
            onAdd(bot);
        }

        setBotName('');
        setBotPrice(0);
        setBotHealth(0);
        setBotAttack(0);
        setBotDefense(0);
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
            <input
                type="number"
                placeholder="Bot Health"
                value={botHealth}
                onChange={(e) => setBotHealth(parseInt(e.target.value))}
            />
            <input
                type="number"
                placeholder="Bot Attack"
                value={botAttack}
                onChange={(e) => setBotAttack(parseInt(e.target.value))}
            />
            <input
                type="number"
                placeholder="Bot Defense"
                value={botDefense}
                onChange={(e) => setBotDefense(parseInt(e.target.value))}
            />
            <button onClick={handleSaveBot} disabled={!botName || !botPrice || !botHealth || !botAttack || !botDefense}>
                {botToEdit ? 'Update Bot' : 'Add Bot'}
            </button>
        </div>
    );
};

export default BotCreator;
