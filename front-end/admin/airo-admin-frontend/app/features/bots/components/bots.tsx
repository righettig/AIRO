import { useEffect, useState } from 'react';

import Bot from '../types/bot';
import BotCreator from './bot-creator';
import BotList from './bot-list';

import { fetchBots, addBot, updateBot, deleteBot } from '@/app/common/bots.service';

const Bots = () => {
    const [botList, setBotList] = useState<Bot[]>([]);
    const [botToEdit, setBotToEdit] = useState<Bot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getBots = async () => {
            try {
                const bots = await fetchBots();
                setBotList(bots);
            } catch (err) {
                setError('Failed to fetch bots.');
            } finally {
                setLoading(false);
            }
        };

        getBots();
    }, []);

    const handleAddBot = async ({ name, price, health, attack, defense }: Bot) => {
        try {
            const id = await addBot({ name, price, health, attack, defense });
            setBotList([...botList, { id, name, price, health, attack, defense } ]);
        } catch (err) {
            setError('Failed to add bot.');
        }
    };

    const handleUpdateBot = async (updatedBot: Bot) => {
        try {
            await updateBot(updatedBot.id, updatedBot);
            setBotList(botList.map(bot =>
                bot.id === updatedBot.id ? updatedBot : bot
            ));
            setBotToEdit(null);
        } catch (err) {
            setError('Failed to update bot.');
        }
    };

    const handleDeleteBot = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this bot?')) {
            try {
                await deleteBot(id);
                setBotList(botList.filter(bot => bot.id !== id));
            } catch (err) {
                setError('Failed to delete bot.');
            }
        }
    };

    const handleEditBot = (bot: Bot) => {
        setBotToEdit(bot);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Bot Management</h1>
            <BotCreator
                onAdd={handleAddBot}
                onUpdate={handleUpdateBot}
                botToEdit={botToEdit}
            />
            {error && <div>{error}</div>}
            {!error && <BotList
                bots={botList}
                onDelete={handleDeleteBot}
                onEdit={handleEditBot}
            />}
        </div>
    );
};

export default Bots;
