import React, {useEffect, useState} from "react";
import "./SessionsPage.css";
import api from "../../data/axios-instance"
import SessionCard from "../../components/SessionCard/SessionCard";
import SessionModal from "./SessionModal/SessionModal";

interface Session {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
}

const SessionsPage: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddSession = (newSession: Session) => {
        setSessions(prev => [newSession, ...prev]);
    };

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get<Session[]>("/api/v1/session/all");
                setSessions(response.data);
            } catch (err) {
                setError(err.message || "Ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    if (loading) {
        return (
            <div className="sessions-page">
                <div className="sessions-page__header">
                    <div>
                        <h1 className="sessions-page__title">Загрузка...</h1>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sessions-page">
                <div className="sessions-page__header">
                    <div>
                        <h1 className="sessions-page__title">Ошибка</h1>
                        <p className="sessions-page__subtitle">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sessions-page">
            <div className="sessions-page__header">
                <div>
                    <h1 className="sessions-page__title">Смены</h1>
                    <p className="sessions-page__subtitle">
                        {sessions.length > 0 
                            ? `Всего смен: ${sessions.length}` 
                            : 'Создайте свою первую смену'}
                    </p>
                </div>
            </div>

            {sessions.length > 0 ? (
                <div className="sessions-list">
                    {sessions.map((session) => (
                        <SessionCard 
                            key={session.id}
                            id={session.id} 
                            name={session.name} 
                            description={session.description}
                            startDate={session.startDate} 
                            endDate={session.endDate}
                            imageUrl={session.imageUrl}
                        />
                    ))}
                </div>
            ) : (
                <div className="sessions-empty">
                    <img 
                        src="/icons/empty_state.svg" 
                        alt="Нет сессий" 
                        className="sessions-empty__icon"
                    />
                    <p className="sessions-empty__text">
                        У вас пока нет созданных сессий
                    </p>
                </div>
            )}

            <button className="floating-button" onClick={() => setShowModal(true)}>
                <img src="/icons/add_icon.svg" alt="Добавить"/>
            </button>

            {showModal && (
                <SessionModal 
                    onClose={() => setShowModal(false)} 
                    onAddSession={handleAddSession}
                />
            )}
        </div>
    );
};

export default SessionsPage;
