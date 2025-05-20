import React, { useState, useEffect } from 'react';
import { concatUrl } from '../../data/axios-instance';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './CharacterCard.css';

interface CharacterCardProps {
    id: number;
    name: string;
    player: string;
    story: string;
    clan: string;
    imageUrl: string;
    sessionId: number;
}

interface Goal {
    id: number;
    characterId: number;
    name: string;
    isCompleted: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
    id,
    name,
    player,
    story,
    clan,
    imageUrl,
    sessionId
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        if (isExpanded && sessionId) {
            const fetchGoals = async () => {
                try {
                    const response = await api.get<Goal[]>(`/api/v1/goal/character-all?sessionId=${sessionId}`);
                    console.log('All goals:', response.data);
                    const characterGoals = response.data.filter(goal => goal.characterId === id);
                    console.log(`Goals for character ${id}:`, characterGoals);
                    setGoals(characterGoals);
                } catch (err) {
                    console.error('Error fetching goals:', err);
                }
            };
            fetchGoals();
        }
    }, [isExpanded, sessionId, id]);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Здесь будет логика удаления после добавления эндпоинта
        console.log('Delete character:', id);
    };

    return (
        <BaseCard className="character-card">
            <div className="character-card__content">
                <div className="character-card__header">
                    <img 
                        className="character-card__image" 
                        src={imageUrl ? concatUrl(`/${imageUrl}`, true) : "/img_fish.png"} 
                        alt={name}
                    />
                    <h3 className="character-card__name">{name}</h3>
                    <button 
                        className="character-card__delete-button"
                        onClick={handleDelete}
                    >
                        <img 
                            src="/icons/ic_delete.svg" 
                            alt="Удалить" 
                            className="character-card__delete-icon"
                        />
                    </button>
                </div>
                <div className="character-card__info">
                    <p className="character-card__player">Отыгрывающий: {player}</p>
                    <p className="character-card__clan">Клан: {clan}</p>
                </div>
                <div className="character-card__expanded-content" style={{ display: isExpanded ? 'flex' : 'none' }}>
                    <div className={`character-card__story ${isExpanded ? 'expanded' : ''}`}>
                        <h4>История</h4>
                        <p>{story}</p>
                    </div>
                    <div className={`character-card__goals ${isExpanded ? 'expanded' : ''}`}>
                        <h4>Цели</h4>
                        {goals.length > 0 ? (
                            <ul className="character-card__goals-list">
                                {goals.map((goal, index) => (
                                    <li 
                                        key={goal.id} 
                                        className={`character-card__goal ${goal.isCompleted ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}
                                        style={{ 
                                            transitionDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        {goal.name}
                                        {goal.isCompleted && (
                                            <span className="character-card__goal-status">✓</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>У персонажа нет целей</p>
                        )}
                    </div>
                </div>
            </div>
            <div 
                className="character-card__expand"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <img 
                    className={`character-card__expand-icon ${isExpanded ? 'expanded' : ''}`}
                    src="/icons/ic_arrow_down.svg" 
                    alt="Развернуть"
                />
            </div>
        </BaseCard>
    );
};

export default CharacterCard; 