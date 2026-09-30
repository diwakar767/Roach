import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { getLoginStatus, getUser } from "../../services/authService";
import { SET_LOGIN, SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";

const ShopGate = ({ children, adminOnly = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);

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
            dispatch(SET_LOGIN(true));
            const user = await getUser();
            if (!active || !user) {
                return;
            }
            dispatch(SET_USER(user));
            dispatch(SET_NAME(user.name));
            if (user.access === "blocked") {
                navigate("/blocked");
                return;
            }
            if (adminOnly && user.role !== "admin") {
                navigate("/dashboard");
                return;
            }
            setReady(true);
        }
        check();
        return () => {
            active = false;
        };
    }, [adminOnly, dispatch, navigate]);

    if (!ready) {
        return <Loader />;
    }
    return children;
};

export default ShopGate;
