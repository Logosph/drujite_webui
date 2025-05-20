import React, {useState} from "react";
import "./SessionModal.css";
import api from "../../../data/axios-instance"
import DefaultButton from "../../../components/DefaultButton/DefaultButton";

interface Props {
    onClose: () => void;
    onAddSession: (newSession: any) => void;
}

const SessionModal: React.FC<Props> = ({onClose, onAddSession}) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        image: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm({...form, image: file});
    };

    const handleSubmit = async () => {
        try {
            const {image, ...sessionData} = form;

            // Сначала создаём сессию
            const response = await api.post("/api/v1/session", {
                ...sessionData,
                imageUrl: null,
            });

            // Затем отправляем файл в application/octet-stream
            if (image) {
                const arrayBuffer = await image.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);
                await api.post(`/api/v1/images/sessions/${response.data.id}`, byteArray, {
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }
                });
            }

            onAddSession(response.data);
            onClose();
            window.location.reload()
        } catch (err) {
            alert("Ошибка при создании сессии");
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <h2>Новая смена</h2>
                
                <div className="modal-field">
                    <label htmlFor="name">Название</label>
                    <input 
                        id="name"
                        type="text" 
                        name="name" 
                        placeholder="Введите название смены" 
                        value={form.name} 
                        onChange={handleChange}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="description">Описание</label>
                    <textarea 
                        id="description"
                        name="description" 
                        placeholder="Введите описание смены" 
                        value={form.description} 
                        onChange={handleChange}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="startDate">Дата начала</label>
                    <input 
                        id="startDate"
                        type="datetime-local" 
                        name="startDate" 
                        value={form.startDate} 
                        onChange={handleChange}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="endDate">Дата окончания</label>
                    <input 
                        id="endDate"
                        type="datetime-local" 
                        name="endDate" 
                        value={form.endDate} 
                        onChange={handleChange}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="image">Изображение</label>
                    <input 
                        id="image"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />
                </div>

                <div className="buttons">
                    <button className="modal-button secondary" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="modal-button primary" onClick={handleSubmit}>
                        Создать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionModal;
