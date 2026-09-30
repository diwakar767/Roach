import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { blockUser, getAdminUsers, messageFrom, recordPayment } from "../../services/shopService";
import "../shop/shop.scss";

const formatDate = (value) => {
    if (!value) {
        return "—";
    }
    return new Date(value).toLocaleDateString();
};

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [drafts, setDrafts] = useState({});

    const load = async () => {
        try {
            setUsers(await getAdminUsers());
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    useEffect(() => {
        load();
    }, []);

    const draft = (id) => drafts[id] || { months: "1", amount: "", note: "" };

    const setDraft = (id, field, value) => {
        setDrafts({
            ...drafts,
            [id]: { ...draft(id), [field]: value }
        });
    };

    const pay = async (id) => {
        const current = draft(id);
        try {
            await recordPayment(id, {
                months: current.months,
                amount: current.amount,
                note: current.note
            });
            toast.success("Payment recorded");
            await load();
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    const block = async (id) => {
        try {
            await blockUser(id);
            toast.success("Access blocked. Shop data is kept.");
            await load();
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    return (
        <div>
            <h3 className="--mt">Subscriptions</h3>
            <p>Record an offline payment to open the shop for another month. Blocking a shop keeps its data and only removes access.</p>
            <table className="shop-table">
                <thead>
                    <tr>
                        <th>Shop</th>
                        <th>Status</th>
                        <th>Trial ends</th>
                        <th>Paid through</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}<br />{user.email}</td>
                            <td>{user.access}</td>
                            <td>{formatDate(user.trialEndsAt)}</td>
                            <td>{formatDate(user.paidUntil)}</td>
                            <td>
                                {user.role === "admin" ? "Platform admin" : (
                                    <div className="shop-actions">
                                        <input type="number" min="1" step="1" value={draft(user._id).months} onChange={(event) => setDraft(user._id, "months", event.target.value)} />
                                        <input type="number" min="0" step="0.01" placeholder="Amount" value={draft(user._id).amount} onChange={(event) => setDraft(user._id, "amount", event.target.value)} />
                                        <input type="text" placeholder="Note" value={draft(user._id).note} onChange={(event) => setDraft(user._id, "note", event.target.value)} />
                                        <button type="button" className="--btn --btn-primary" onClick={() => pay(user._id)}>Record payment</button>
                                        <button type="button" className="--btn --btn-danger" onClick={() => block(user._id)}>Block now</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
