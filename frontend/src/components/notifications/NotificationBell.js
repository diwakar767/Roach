import React, { useCallback, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    clearNotifications,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    messageFrom
} from "../../services/shopService";

const NotificationBell = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

    const load = useCallback(async () => {
        try {
            const data = await getNotifications();
            setItems(data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                return;
            }
        }
    }, []);

    useEffect(() => {
        load();
        const timer = setInterval(load, 20000);
        window.addEventListener("roach-notifications", load);
        return () => {
            clearInterval(timer);
            window.removeEventListener("roach-notifications", load);
        };
    }, [load]);

    const unread = items.filter((item) => !item.read).length;

    const readAll = async () => {
        try {
            await markAllNotificationsRead();
            await load();
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    const clearAll = async () => {
        try {
            await clearNotifications();
            setItems([]);
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    const openItem = async (item) => {
        try {
            if (!item.read) {
                await markNotificationRead(item._id);
            }
            setOpen(false);
            if (item.product) {
                navigate(`/product-detail/${item.product}`);
            }
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    return (
        <div className="notify">
            <button type="button" className="notify-bell" onClick={() => setOpen(!open)} aria-label="Notifications">
                <FaBell />
                {unread > 0 && <span className="notify-count">{unread}</span>}
            </button>
            {open && (
                <div className="notify-panel">
                    <div className="notify-actions">
                        <button type="button" onClick={readAll}>Read all</button>
                        <button type="button" onClick={clearAll}>Clear all</button>
                    </div>
                    {items.length === 0 && <p className="notify-empty">No notifications</p>}
                    {items.map((item) => (
                        <div key={item._id} className={item.read ? "notify-item" : "notify-item unread"}>
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
                            <button type="button" onClick={() => openItem(item)}>Open</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
