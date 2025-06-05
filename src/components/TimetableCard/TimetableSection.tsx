import React, { useState, useEffect } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './TimetableSection.css';

interface TimetableSectionProps {
    sessionId: number;
    onTimetableAdded: () => void;
}

interface Timetable {
    id: number;
    sessionId: number;
    date: string;
}

interface Event {
    id: number;
    timetableId: number;
    num: number;
    name: string;
    time: string;
    isTitle: boolean;
}

const TimetableSection: React.FC<TimetableSectionProps> = ({ sessionId, onTimetableAdded }) => {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        time: '',
        isTitle: false
    });
    const [newDate, setNewDate] = useState('');

    useEffect(() => {
        fetchTimetables();
    }, [sessionId]);

    useEffect(() => {
        if (selectedTimetable) {
            fetchEvents(selectedTimetable.id);
        }
    }, [selectedTimetable]);

    const fetchTimetables = async () => {
        try {
            const response = await api.get<Timetable[]>(`/api/v1/timetable/session-all?sessionId=${sessionId}`);
            const sortedTimetables = response.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setTimetables(sortedTimetables);
            if (sortedTimetables.length > 0 && !selectedTimetable) {
                setSelectedTimetable(sortedTimetables[0]);
            }
        } catch (err) {
            console.error('Error fetching timetables:', err);
        }
    };

    const fetchEvents = async (timetableId: number) => {
        try {
            const response = await api.get<Event[]>(`/api/v1/event/by-timetable?id=${timetableId}`);
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

    const handleAddTimetable = async () => {
        if (!newDate) return;

        try {
            await api.post('/api/v1/timetable', {
                sessionId,
                date: newDate
            });
            setNewDate('');
            onTimetableAdded();
            await fetchTimetables();
        } catch (err) {
            console.error('Error adding timetable:', err);
        }
    };

    const handleDeleteTimetable = async (timetableId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту дату?')) {
            try {
                await api.delete(`/api/v1/timetable?id=${timetableId}`);
                await fetchTimetables();
                if (selectedTimetable?.id === timetableId) {
                    setSelectedTimetable(null);
                }
            } catch (err) {
                console.error('Error deleting timetable:', err);
            }
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTimetable || !newEvent.name.trim() || !newEvent.time.trim()) return;

        try {
            await api.post('/api/v1/event', {
                timetableId: selectedTimetable.id,
                name: newEvent.name,
                time: newEvent.time,
                isTitle: newEvent.isTitle
            });
            setNewEvent({ name: '', time: '', isTitle: false });
            setIsAddingEvent(false);
            await fetchEvents(selectedTimetable.id);
        } catch (err) {
            console.error('Error adding event:', err);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
            try {
                await api.delete(`/api/v1/event?id=${eventId}`);
                if (selectedTimetable) {
                    await fetchEvents(selectedTimetable.id);
                }
            } catch (err) {
                console.error('Error deleting event:', err);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    return (
        <div className="timetable-section">
            <div className="timetable-section__header">
                <div className="timetable-section__tabs">
                    {timetables.map((timetable) => (
                        <button
                            key={timetable.id}
                            className={`timetable-section__tab ${selectedTimetable?.id === timetable.id ? 'active' : ''}`}
                            onClick={() => setSelectedTimetable(timetable)}
                        >
                            {formatDate(timetable.date)}
                            <button 
                                className="timetable-section__tab-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTimetable(timetable.id);
                                }}
                            >
                                <img src="/icons/ic_delete.svg" alt="Удалить дату" />
                            </button>
                        </button>
                    ))}
                    <div className="timetable-section__add-date">
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="timetable-section__date-input"
                        />
                        <button 
                            className="timetable-section__add-button"
                            onClick={handleAddTimetable}
                            disabled={!newDate}
                        >
                            <img src="/icons/ic_add.svg" alt="Добавить дату" />
                        </button>
                    </div>
                </div>
            </div>

            {selectedTimetable && (
                <div className="timetable-section__content">
                    <div className="timetable-section__toolbar">
                        <h3>{formatDate(selectedTimetable.date)}</h3>
                        <button 
                            className="timetable-section__add-event-button"
                            onClick={() => setIsAddingEvent(true)}
                        >
                            Добавить событие
                        </button>
                    </div>

                    {isAddingEvent && (
                        <form onSubmit={handleAddEvent} className="timetable-section__add-event-form">
                            <div className="timetable-section__form-row">
                                <input
                                    type="time"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                    className="timetable-section__time-input"
                                    required
                                />
                                <input
                                    type="text"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Название события"
                                    className="timetable-section__name-input"
                                    required
                                />
                                <label className="timetable-section__checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newEvent.isTitle}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, isTitle: e.target.checked }))}
                                    />
                                    Выделить жирным
                                </label>
                                <div className="timetable-section__form-actions">
                                    <button type="submit" className="timetable-section__submit-button">
                                        Добавить
                                    </button>
                                    <button 
                                        type="button" 
                                        className="timetable-section__cancel-button"
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
                        <div className="timetable-section__events">
                            {events.map((event) => (
                                <div 
                                    key={event.id}
                                    className={`timetable-section__event ${event.isTitle ? 'is-title' : ''}`}
                                >
                                    <span className="timetable-section__event-time">{event.time !== 'null' ? event.time : ''}</span>
                                    <span className="timetable-section__event-name">{event.name}</span>
                                    <button 
                                        className="timetable-section__event-delete"
                                        onClick={() => handleDeleteEvent(event.id)}
                                    >
                                        <img src="/icons/ic_delete.svg" alt="Удалить событие" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="timetable-section__no-events">Нет событий на этот день</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimetableSection; 