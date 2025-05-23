import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinearLayout from '../../components/Layouts/LinearLayout';
import DefaultButton from '../../components/DefaultButton/DefaultButton';
import api from '../../data/axios-instance';
import SessionCard from '../../components/SessionCard/SessionCard';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import BaseCard from '../../components/BaseCard/BaseCard';
import NewsCard from '../../components/NewsCard/NewsCard';
import AddNewsCard from '../../components/NewsCard/AddNewsCard';
import ClanCard from '../../components/ClanCard/ClanCard';
import AddClanCard from '../../components/ClanCard/AddClanCard';
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

interface NewsItem {
    id: number;
    sessionId: number;
    title: string;
    content: string;
    dateTime: string;
    imageUrl: string;
}

interface Clan {
    id: number;
    name: string;
    description: string;
}

type MainContentType = 'news' | 'characters';

const ChosenSessionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<Session | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [mainContent, setMainContent] = useState<MainContentType>('news');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState<boolean>(true);
    const [newsError, setNewsError] = useState<string | null>(null);
    const [expandedNews, setExpandedNews] = useState<number[]>([]);
    const [clans, setClans] = useState<Clan[]>([]);
    const [expandedClans, setExpandedClans] = useState<number[]>([]);

    const fetchNews = async () => {
        try {
            const response = await api.get<NewsItem[]>(`/api/v1/news/session?sessionId=${id}`);
            setNews(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ошибка при загрузке новостей";
            setNewsError(errorMessage);
        } finally {
            setNewsLoading(false);
        }
    };

    const fetchClans = async () => {
        try {
            const response = await api.get<Clan[]>(`/api/v1/clan/session-all?sessionId=${id}`);
            setClans(response.data);
        } catch (err) {
            console.error('Error fetching clans:', err);
        }
    };

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
            fetchNews();
            fetchClans();
        }
    }, [id]);

    const toggleNewsExpand = (newsId: number) => {
        setExpandedNews(prev => prev.includes(newsId) ? prev.filter(id => id !== newsId) : [...prev, newsId]);
    };

    const toggleClanExpand = (clanId: number) => {
        setExpandedClans(prev => prev.includes(clanId) ? prev.filter(id => id !== clanId) : [...prev, clanId]);
    };

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
                                {newsLoading ? (
                                    <p>Загрузка новостей...</p>
                                ) : newsError ? (
                                    <p style={{ color: 'red' }}>Ошибка: {newsError}</p>
                                ) : (
                                    <>
                                        <AddNewsCard 
                                            sessionId={Number(id)} 
                                            onNewsAdded={fetchNews}
                                        />
                                        {news.length === 0 ? (
                                            <p>Новостей пока нет</p>
                                        ) : (
                                            news
                                                .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                                                .map(item => (
                                                    <NewsCard
                                                        key={item.id}
                                                        id={item.id}
                                                        title={item.title}
                                                        content={item.content}
                                                        dateTime={item.dateTime}
                                                        imageUrl={item.imageUrl}
                                                        isExpanded={expandedNews.includes(item.id)}
                                                        onToggleExpand={() => toggleNewsExpand(item.id)}
                                                        onNewsDeleted={fetchNews}
                                                    />
                                                ))
                                        )}
                                    </>
                                )}
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
                            <AddClanCard 
                                sessionId={Number(id)} 
                                onClanAdded={fetchClans}
                            />
                            {clans
                                .sort((a, b) => b.id - a.id)
                                .map(clan => (
                                    <ClanCard
                                        key={clan.id}
                                        id={clan.id}
                                        name={clan.name}
                                        description={clan.description}
                                        isExpanded={expandedClans.includes(clan.id)}
                                        onToggleExpand={() => toggleClanExpand(clan.id)}
                                        onClanDeleted={fetchClans}
                                    />
                                ))}
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