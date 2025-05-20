import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinearLayout from '../../components/Layouts/LinearLayout';
import DefaultButton from '../../components/DefaultButton/DefaultButton';
import api from '../../data/axios-instance';
import SessionCard from '../../components/SessionCard/SessionCard';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import BaseCard from '../../components/BaseCard/BaseCard';
import './ChosenSessionPage.css';

interface Session {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
}

interface Character {
    id: number;
    name: string;
    player: string;
    story: string;
    clan: string;
    imageUrl: string;
}

type MainContentType = 'news' | 'characters';

const ChosenSessionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<Session | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [mainContent, setMainContent] = useState<MainContentType>('news');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await api.get<Session>(`/api/v1/session?id=${id}`);
                setSession(response.data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Ошибка при загрузке данных";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        const fetchCharacters = async () => {
            try {
                const response = await api.get<Character[]>(`/api/v1/users-characters/session-all?sessionId=${id}`);
                setCharacters(response.data);
            } catch (err) {
                console.error('Error fetching characters:', err);
            }
        };

        if (id) {
            fetchSession();
            fetchCharacters();
        }
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!session) return <div>Сессия не найдена</div>;

    return (
        <div className="chosen-session-page">
            <div className="session-header">
                <SessionCard
                    id={session.id}
                    name={session.name}
                    description={session.description}
                    startDate={session.startDate}
                    endDate={session.endDate}
                    imageUrl={session.imageUrl}
                    clickable={false}
                />
            </div>

            <div className="content-layout">
                <BaseCard className="main-section">
                    <div className="section-header">
                        <DefaultButton 
                            onClick={() => setMainContent('news')}
                            className={`toggle-button ${mainContent === 'news' ? 'active' : ''}`}
                        >
                            Новости
                        </DefaultButton>
                        <DefaultButton 
                            onClick={() => setMainContent('characters')}
                            className={`toggle-button ${mainContent === 'characters' ? 'active' : ''}`}
                        >
                            Персонажи
                        </DefaultButton>
                    </div>
                    <div className="section-content">
                        {mainContent === 'news' ? (
                            <div className="news-content">
                                {/* News content will be here */}
                                <p>Здесь будут новости</p>
                            </div>
                        ) : (
                            <div className="characters-content">
                                {characters.map(character => (
                                    <CharacterCard
                                        key={character.id}
                                        {...character}
                                        sessionId={Number(id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </BaseCard>

                <div className="side-sections">
                    <BaseCard className="section clans-section">
                        <h3>Кланы</h3>
                        <div className="section-content">
                            {/* Clans content will be here */}
                            <p>Здесь будут кланы</p>
                        </div>
                    </BaseCard>

                    <BaseCard className="section schedule-section">
                        <h3>Расписание</h3>
                        <div className="section-content">
                            {/* Schedule content will be here */}
                            <p>Здесь будет расписание</p>
                        </div>
                    </BaseCard>
                </div>
            </div>
        </div>
    );
};

export default ChosenSessionPage; 