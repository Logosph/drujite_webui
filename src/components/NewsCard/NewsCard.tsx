import React from 'react';
import { concatUrl } from '../../data/axios-instance';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './NewsCard.css';

interface NewsCardProps {
    id: number;
    title: string;
    content: string;
    dateTime: string;
    imageUrl: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onNewsDeleted?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
    id, 
    title, 
    content, 
    dateTime, 
    imageUrl, 
    isExpanded, 
    onToggleExpand,
    onNewsDeleted 
}) => {
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
            try {
                await api.delete(`/api/v1/news?id=${id}`);
                onNewsDeleted?.();
            } catch (err) {
                alert('Ошибка при удалении новости');
                console.error(err);
            }
        }
    };

    return (
        <BaseCard className="news-card">
            <div className="news-card__content">
                <div className="news-card__header">
                    <img
                        src={imageUrl ? concatUrl(`/${imageUrl}`, true) : "/img_fish.png"}
                        alt={title}
                        className="news-card__image"
                    />
                    <h3 className="news-card__title">{title}</h3>
                    <button 
                        className="news-card__delete-button"
                        onClick={handleDelete}
                    >
                        <img 
                            src="/icons/ic_delete.svg" 
                            alt="Удалить" 
                            className="news-card__delete-icon"
                        />
                    </button>
                </div>
                <div className="news-card__info">
                    <p className="news-card__date">{new Date(dateTime).toLocaleString('ru-RU')}</p>
                </div>
                <div className="news-card__expanded-content" style={{ display: isExpanded ? 'flex' : 'none' }}>
                    <div className={`news-card__description ${isExpanded ? 'expanded' : ''}`}>
                        {content}
                    </div>
                </div>
            </div>
            <div 
                className="news-card__expand"
                onClick={onToggleExpand}
            >
                <img 
                    className={`news-card__expand-icon ${isExpanded ? 'expanded' : ''}`}
                    src="/icons/ic_arrow_down.svg" 
                    alt={isExpanded ? "Скрыть" : "Показать больше"}
                />
            </div>
        </BaseCard>
    );
};

export default NewsCard; 