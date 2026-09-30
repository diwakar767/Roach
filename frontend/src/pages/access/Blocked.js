import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { getLoginStatus, getUser, logoutUser } from "../../services/authService";
import { SET_LOGIN, SET_USER } from "../../redux/features/auth/authSlice";

const Blocked = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        async function check() {
            const status = await getLoginStatus();
            if (!active) {
                return;
            }
            if (!status) {
                navigate("/login");
                return;
            }
            const user = await getUser();
            if (!active || !user) {
                return;
            }
            dispatch(SET_USER(user));
            if (user.access !== "blocked") {
                navigate("/dashboard");
            }
        }
        check();
        return () => {
            active = false;
        };
    }, [dispatch, navigate]);

    const logout = async () => {
        await logoutUser();
        dispatch(SET_LOGIN(false));
        navigate("/login");
    };

    return (
        <div className="container --mt">
            <Card cardClass="card">
                <h2>Access is paused</h2>
                <p>Your free month has ended. Your products, invoices, and photos are still stored.</p>
                <p>Pay the operator in person. After they record the payment, sign in again and the shop opens for the next month.</p>
                <button type="button" className="--btn --btn-danger" onClick={logout}>Logout</button>
            </Card>
        </div>
    );
};

export default Blocked;
