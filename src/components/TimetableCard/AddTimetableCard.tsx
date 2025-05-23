import React, { useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './TimetableCard.css';

interface AddTimetableCardProps {
    sessionId: number;
    onTimetableAdded: () => void;
}

const AddTimetableCard: React.FC<AddTimetableCardProps> = ({ sessionId, onTimetableAdded }) => {
    const [date, setDate] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/api/v1/timetable', {
                sessionId,
                date
            });

            // Очищаем форму
            setDate('');

            // Уведомляем родителя о добавлении даты
            onTimetableAdded();
        } catch (err) {
            alert('Ошибка при добавлении даты');
            console.error(err);
        }
    };

    return (
        <BaseCard className="timetable-card add-timetable-card">
            <div className="timetable-card__content">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="timetable-card__date-input"
                />
                <button 
                    className="timetable-card__submit-button" 
                    onClick={handleSubmit}
                    disabled={!date}
                >
                    Добавить дату
                </button>
            </div>
        </BaseCard>
    );
};

export default AddTimetableCard; 