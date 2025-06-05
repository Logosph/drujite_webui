import React, { useState, useEffect } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './TimetableCard.css';

interface TimetableCardProps {
    id: number;
    date: string;
    onTimetableDeleted: () => void;
}

interface Event {
    id: number;
    timetableId: number;
    num: number;
    name: string;
    time: string;
    isTitle: boolean;
}

const TimetableCard: React.FC<TimetableCardProps> = ({ 
    id, 
    date,
    onTimetableDeleted 
}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        time: '',
        isTitle: false
    });

    useEffect(() => {
        if (isExpanded) {
            fetchEvents();
        }
    }, [isExpanded]);

    const fetchEvents = async () => {
        try {
            const response = await api.get<Event[]>(`/api/v1/event/by-timetable?id=${id}`);
            // Сортируем события по времени
            const sortedEvents = response.data.sort((a, b) => {
                const timeA = a.time.split(':').map(Number);
                const timeB = b.time.split(':').map(Number);
                return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
            });
            setEvents(sortedEvents);
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

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

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.name.trim() || !newEvent.time.trim()) return;

        try {
            await api.post('/api/v1/event', {
                timetableId: id,
                name: newEvent.name,
                time: newEvent.time,
                isTitle: newEvent.isTitle
            });
            setNewEvent({ name: '', time: '', isTitle: false });
            setIsAddingEvent(false);
            await fetchEvents();
        } catch (err) {
            console.error('Error adding event:', err);
        }
    };

    const handleDeleteEvent = async (eventId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
            try {
                await api.delete(`/api/v1/event?id=${eventId}`);
                await fetchEvents();
            } catch (err) {
                console.error('Error deleting event:', err);
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
                <div 
                    className="timetable-card__header"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="timetable-card__date">{formatDate(date)}</h3>
                    <div className="timetable-card__actions">
                        <button 
                            className="timetable-card__add-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingEvent(true);
                            }}
                        >
                            <img src="/icons/ic_add.svg" alt="Добавить событие" />
                        </button>
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
                        <img 
                            className={`timetable-card__expand-icon ${isExpanded ? 'expanded' : ''}`}
                            src="/icons/ic_arrow_down.svg" 
                            alt="Развернуть"
                        />
                    </div>
                </div>

                {isExpanded && (
                    <div className="timetable-card__events">
                        {isAddingEvent && (
                            <form onSubmit={handleAddEvent} className="timetable-card__add-event-form">
                                <div className="timetable-card__form-row">
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                        className="timetable-card__time-input"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={newEvent.name}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Название события"
                                        className="timetable-card__name-input"
                                        required
                                    />
                                </div>
                                <div className="timetable-card__form-row">
                                    <label className="timetable-card__checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={newEvent.isTitle}
                                            onChange={(e) => setNewEvent(prev => ({ ...prev, isTitle: e.target.checked }))}
                                        />
                                        Выделить жирным
                                    </label>
                                    <div className="timetable-card__form-actions">
                                        <button type="submit" className="timetable-card__submit-button">
                                            Добавить
                                        </button>
                                        <button 
                                            type="button" 
                                            className="timetable-card__cancel-button"
                                            onClick={() => {
                                                setIsAddingEvent(false);
                                                setNewEvent({ name: '', time: '', isTitle: false });
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                        
                        {events.length > 0 ? (
                            <ul className="timetable-card__events-list">
                                {events.map((event) => (
                                    <li 
                                        key={event.id}
                                        className={`timetable-card__event ${event.isTitle ? 'is-title' : ''}`}
                                    >
                                        <span className="timetable-card__event-time">{event.time}</span>
                                        <span className="timetable-card__event-name">{event.name}</span>
                                        <button 
                                            className="timetable-card__event-delete"
                                            onClick={(e) => handleDeleteEvent(event.id, e)}
                                        >
                                            <img src="/icons/ic_delete.svg" alt="Удалить событие" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="timetable-card__no-events">Нет событий на этот день</p>
                        )}
                    </div>
                )}
            </div>
        </BaseCard>
    );
};

export default TimetableCard; 