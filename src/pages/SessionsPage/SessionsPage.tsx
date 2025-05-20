import React, {useEffect, useState} from "react";
import "./SessionsPage.css";
import api, {concatUrl} from "../../data/axios-instance"
import LinearLayout from "../../components/Layouts/LinearLayout";
import internal from "node:stream";
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

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <>
            <LinearLayout className="wrapper">
                {sessions.map((session) => (

                    <SessionCard id={session.id} name={session.name} description={session.description}
                                 startDate={session.startDate} endDate={session.endDate}
                                 imageUrl={session.imageUrl}/>

                ))}
            </LinearLayout>

            <button className="floating-button" onClick={() => setShowModal(true)}>
                <img src="/icons/add_icon.svg" alt="Добавить"/>
            </button>

            {showModal && <SessionModal onClose={() => setShowModal(false)} onAddSession={handleAddSession}/>}

        </>
    );
};

export default SessionsPage;
