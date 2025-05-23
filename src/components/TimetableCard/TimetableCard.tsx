import React from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './TimetableCard.css';

interface TimetableCardProps {
    id: number;
    date: string;
    onTimetableDeleted: () => void;
}

const TimetableCard: React.FC<TimetableCardProps> = ({ 
    id, 
    date,
    onTimetableDeleted 
}) => {
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить эту дату?')) {
            try {
                await api.delete(`/api/v1/timetable?id=${id}`);
                onTimetableDeleted();
            } catch (err) {
                alert('Ошибка при удалении даты');
                console.error(err);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    return (
        <BaseCard className="timetable-card">
            <div className="timetable-card__content">
                <div className="timetable-card__header">
                    <h3 className="timetable-card__date">{formatDate(date)}</h3>
                    <button 
                        className="timetable-card__delete-button"
                        onClick={handleDelete}
                    >
                        <img 
                            src="/icons/ic_delete.svg" 
                            alt="Удалить" 
                            className="timetable-card__delete-icon"
                        />
                    </button>
                </div>
            </div>
        </BaseCard>
    );
};

export default TimetableCard; 