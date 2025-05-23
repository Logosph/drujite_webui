import React, { useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import api from '../../data/axios-instance';
import './NewsCard.css';

interface AddNewsCardProps {
    sessionId: number;
    onNewsAdded: () => void;
}

const AddNewsCard: React.FC<AddNewsCardProps> = ({ sessionId, onNewsAdded }) => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        image: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm(prev => ({ ...prev, image: file }));
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async () => {
        try {
            // Сначала создаём новость
            const response = await api.post('/api/v1/news', {
                sessionId,
                title: form.title,
                content: form.content,
                imageUrl: null
            });

            // Затем загружаем изображение, если оно есть
            if (form.image) {
                const arrayBuffer = await form.image.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);
                await api.post(`/api/v1/images/news/${response.data.id}`, byteArray, {
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                });
            }

            // Очищаем форму
            setForm({
                title: '',
                content: '',
                image: null
            });
            setPreviewUrl(null);

            // Уведомляем родителя о добавлении новости
            onNewsAdded();
        } catch (err) {
            alert('Ошибка при создании новости');
            console.error(err);
        }
    };

    return (
        <BaseCard className="news-card add-news-card">
            <div className="news-card__content">
                <div className="news-card__header">
                    <label className="news-card__image-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className="news-card__image-placeholder">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Предпросмотр"
                                    className="news-card__preview-image"
                                />
                            ) : (
                                <img
                                    src="/icons/ic_add_photo.svg"
                                    alt="Добавить фото"
                                    className="news-card__add-photo-icon"
                                />
                            )}
                        </div>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Заголовок новости"
                        className="news-card__title-input"
                    />
                </div>
                <div className="news-card__expanded-content" style={{ display: 'flex' }}>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Текст новости"
                        className="news-card__content-input"
                    />
                </div>
            </div>
            <div className="news-card__footer">
                <button 
                    className="news-card__submit-button" 
                    onClick={handleSubmit}
                    disabled={!form.title || !form.content}
                >
                    Добавить новость
                </button>
            </div>
        </BaseCard>
    );
};

export default AddNewsCard; 