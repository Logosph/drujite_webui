import React, { useState, useEffect } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './ClanCard.css';

interface AddClanCardProps {
    sessionId: number;
    onClanAdded: () => void;
}

interface Clan {
    id: number;
    name: string;
    description: string;
}

const AddClanCard: React.FC<AddClanCardProps> = ({ sessionId, onClanAdded }) => {
    const [mode, setMode] = useState<'create' | 'add'>('create');
    const [form, setForm] = useState({
        name: '',
        description: ''
    });
    const [availableClans, setAvailableClans] = useState<Clan[]>([]);
    const [selectedClanId, setSelectedClanId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'add') {
            fetchAvailableClans();
        }
    }, [mode]);

    const fetchAvailableClans = async () => {
        try {
            setLoading(true);
            // Получаем все кланы
            const allClansResponse = await api.get<Clan[]>('/api/v1/clan/all');
            // Получаем кланы текущей сессии
            const sessionClansResponse = await api.get<Clan[]>(`/api/v1/clan/session-all?sessionId=${sessionId}`);
            
            // Фильтруем кланы, которые еще не добавлены в сессию
            const sessionClanIds = new Set(sessionClansResponse.data.map(clan => clan.id));
            const availableClans = allClansResponse.data.filter(clan => !sessionClanIds.has(clan.id));
            
            setAvailableClans(availableClans);
        } catch (err) {
            console.error('Error fetching available clans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'selectedClan') {
            setSelectedClanId(Number(value));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateClan = async () => {
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

    const handleAddExistingClan = async () => {
        if (!selectedClanId) return;

        try {
            await api.post('/api/v1/clan/add-to-session', {
                clanId: selectedClanId,
                sessionId
            });

            setSelectedClanId(null);
            onClanAdded();
            await fetchAvailableClans(); // Обновляем список доступных кланов
        } catch (err) {
            alert('Ошибка при добавлении клана к сессии');
            console.error(err);
        }
    };

    return (
        <BaseCard className="clan-card add-clan-card">
            <div className="clan-card__content">
                <div className="clan-card__mode-selector">
                    <button 
                        className={`clan-card__mode-button ${mode === 'create' ? 'active' : ''}`}
                        onClick={() => setMode('create')}
                    >
                        Создать новый клан
                    </button>
                    <button 
                        className={`clan-card__mode-button ${mode === 'add' ? 'active' : ''}`}
                        onClick={() => setMode('add')}
                    >
                        Добавить существующий
                    </button>
                </div>

                {mode === 'create' ? (
                    <>
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
                            onClick={handleCreateClan}
                            disabled={!form.name}
                        >
                            Создать клан
                        </button>
                    </>
                ) : (
                    <div className="clan-card__add-existing">
                        {loading ? (
                            <p className="clan-card__loading">Загрузка списка кланов...</p>
                        ) : availableClans.length === 0 ? (
                            <p className="clan-card__no-clans">Нет доступных кланов для добавления</p>
                        ) : (
                            <>
                                <select
                                    name="selectedClan"
                                    value={selectedClanId || ''}
                                    onChange={handleChange}
                                    className="clan-card__select"
                                >
                                    <option value="">Выберите клан</option>
                                    {availableClans.map(clan => (
                                        <option key={clan.id} value={clan.id}>
                                            {clan.name}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    className="clan-card__submit-button" 
                                    onClick={handleAddExistingClan}
                                    disabled={!selectedClanId}
                                >
                                    Добавить к сессии
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </BaseCard>
    );
};

export default AddClanCard; 