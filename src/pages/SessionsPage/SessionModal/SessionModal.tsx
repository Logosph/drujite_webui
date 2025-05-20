import React, {useState} from "react";
import "./SessionModal.css";
import api from "../../../data/axios-instance"

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
        <div className="modal-overlay">
            <div className="modal">
                <h2>Новая сессия</h2>
                <input type="text" name="name" placeholder="Название" value={form.name} onChange={handleChange}/>
                <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange}/>
                <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange}/>
                <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange}/>
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                <div className="buttons">
                    <button onClick={handleSubmit}>Сохранить</button>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};

export default SessionModal;
