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
    story: initialStory,
    clan,
    imageUrl,
    sessionId
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoalName, setNewGoalName] = useState('');
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [story, setStory] = useState(initialStory);
    const [isEditingStory, setIsEditingStory] = useState(false);
    const [editedStory, setEditedStory] = useState(initialStory);

    useEffect(() => {
        if (isExpanded && sessionId) {
            fetchGoals();
        }
    }, [isExpanded, sessionId, id]);

    const fetchGoals = async () => {
        try {
            const response = await api.get<Goal[]>(`/api/v1/goal/session-all?id=${sessionId}`);
            const characterGoals = response.data.filter(goal => goal.characterId === id);
            setGoals(characterGoals);
        } catch (err) {
            console.error('Error fetching goals:', err);
        }
    };

    const handleDeleteGoal = async (goalId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.delete(`/api/v1/goal?id=${goalId}`);
            await fetchGoals();
        } catch (err) {
            console.error('Error deleting goal:', err);
        }
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalName.trim()) return;

        try {
            await api.post('/api/v1/goal', {
                characterId: id,
                sessionId: sessionId,
                name: newGoalName
            });
            setNewGoalName('');
            setIsAddingGoal(false);
            await fetchGoals();
        } catch (err) {
            console.error('Error adding goal:', err);
        }
    };

    const handleSaveStory = async () => {
        try {
            await api.put('/api/v1/character/story', {
                characterId: id,
                story: editedStory
            });
            setStory(editedStory);
            setIsEditingStory(false);
        } catch (err) {
            console.error('Error updating story:', err);
        }
    };

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
                        <div className="character-card__story-header">
                            <h4>Квента</h4>
                            {!isEditingStory ? (
                                <button 
                                    className="character-card__edit-button"
                                    onClick={() => setIsEditingStory(true)}
                                >
                                    <img src="/icons/ic_edit.svg" alt="Редактировать" />
                                </button>
                            ) : (
                                <button 
                                    className="character-card__save-button"
                                    onClick={handleSaveStory}
                                >
                                    Сохранить
                                </button>
                            )}
                        </div>
                        {!isEditingStory ? (
                            <p>{story}</p>
                        ) : (
                            <textarea
                                className="character-card__story-edit"
                                value={editedStory}
                                onChange={(e) => setEditedStory(e.target.value)}
                                rows={5}
                            />
                        )}
                    </div>
                    <div className={`character-card__goals ${isExpanded ? 'expanded' : ''}`}>
                        <div className="character-card__goals-header">
                            <h4>Цели</h4>
                            <button 
                                className="character-card__add-goal-button"
                                onClick={() => setIsAddingGoal(true)}
                            >
                                <img src="/icons/ic_add.svg" alt="Добавить цель" />
                            </button>
                        </div>
                        {isAddingGoal && (
                            <form onSubmit={handleAddGoal} className="character-card__add-goal-form">
                                <input
                                    type="text"
                                    value={newGoalName}
                                    onChange={(e) => setNewGoalName(e.target.value)}
                                    placeholder="Введите новую цель"
                                    className="character-card__add-goal-input"
                                />
                                <div className="character-card__add-goal-actions">
                                    <button type="submit" className="character-card__add-goal-submit">
                                        Добавить
                                    </button>
                                    <button 
                                        type="button" 
                                        className="character-card__add-goal-cancel"
                                        onClick={() => {
                                            setIsAddingGoal(false);
                                            setNewGoalName('');
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        )}
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
                                        <span className="character-card__goal-name">{goal.name}</span>
                                        <div className="character-card__goal-actions">
                                            {goal.isCompleted && (
                                                <span className="character-card__goal-status">✓</span>
                                            )}
                                            <button 
                                                className="character-card__goal-delete"
                                                onClick={(e) => handleDeleteGoal(goal.id, e)}
                                            >
                                                <img src="/icons/ic_delete.svg" alt="Удалить цель" />
                                            </button>
                                        </div>
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