import React from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './ClanCard.css';

interface ClanCardProps {
    id: number;
    name: string;
    description: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onClanDeleted: () => void;
    sessionId: number;
}

const ClanCard: React.FC<ClanCardProps> = ({ 
    id, 
    name, 
    description, 
    isExpanded, 
    onToggleExpand,
    onClanDeleted,
    sessionId
}) => {
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите открепить этот клан от сессии?')) {
            try {
                await api.delete('/api/v1/clan/delete-from-session', {
                    data: {
                        clanId: id,
                        sessionId
                    }
                });
                onClanDeleted();
            } catch (err) {
                alert('Ошибка при откреплении клана');
                console.error(err);
            }
        }
    };

    return (
        <BaseCard className="clan-card">
            <div className="clan-card__content">
                <div className="clan-card__header">
                    <h3 className="clan-card__name">{name}</h3>
                    <button 
                        className="clan-card__delete-button"
                        onClick={handleDelete}
                    >
                        <img 
                            src="/icons/ic_delete.svg" 
                            alt="Открепить" 
                            className="clan-card__delete-icon"
                        />
                    </button>
                </div>
                {description && (
                    <div className="clan-card__expanded-content" style={{ display: isExpanded ? 'flex' : 'none' }}>
                        <div className={`clan-card__description ${isExpanded ? 'expanded' : ''}`}>
                            {description}
                        </div>
                    </div>
                )}
            </div>
            {description && (
                <div 
                    className="clan-card__expand"
                    onClick={onToggleExpand}
                >
                    <img 
                        className={`clan-card__expand-icon ${isExpanded ? 'expanded' : ''}`}
                        src="/icons/ic_arrow_down.svg" 
                        alt={isExpanded ? "Скрыть" : "Показать больше"}
                    />
                </div>
            )}
        </BaseCard>
    );
};

export default ClanCard; 