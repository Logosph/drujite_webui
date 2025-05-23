import React, { useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './ClanCard.css';

interface AddClanCardProps {
    sessionId: number;
    onClanAdded: () => void;
}

const AddClanCard: React.FC<AddClanCardProps> = ({ sessionId, onClanAdded }) => {
    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Создаем клан
            const response = await api.post('/api/v1/clan', {
                name: form.name,
                description: form.description || null
            });

            // Добавляем клан к сессии
            await api.post('/api/v1/clan/add-to-session', {
                clanId: response.data.id,
                sessionId
            });

            // Очищаем форму
            setForm({
                name: '',
                description: ''
            });

            // Уведомляем родителя о добавлении клана
            onClanAdded();
        } catch (err) {
            alert('Ошибка при создании клана');
            console.error(err);
        }
    };

    return (
        <BaseCard className="clan-card add-clan-card">
            <div className="clan-card__content">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Название клана"
                    className="clan-card__name-input"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Описание клана (необязательно)"
                    className="clan-card__description-input"
                />
                <button 
                    className="clan-card__submit-button" 
                    onClick={handleSubmit}
                    disabled={!form.name}
                >
                    Добавить клан
                </button>
            </div>
        </BaseCard>
    );
};

export default AddClanCard; 