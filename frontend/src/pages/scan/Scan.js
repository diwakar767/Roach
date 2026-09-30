import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import productService from "../../redux/features/product/productService";
import "../shop/shop.scss";

const productIdFromScan = (text) => {
    if (!text) {
        return null;
    }
    const match = String(text).match(/\/scan\/([a-fA-F0-9]{24})/);
    if (match) {
        return match[1];
    }
    const trimmed = String(text).trim();
    if (/^[a-fA-F0-9]{24}$/.test(trimmed)) {
        return trimmed;
    }
    return null;
};

const Scan = () => {
    const navigate = useNavigate();
    const [cameraNote, setCameraNote] = useState("");
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const handled = useRef(false);

    useEffect(() => {
        let active = true;
        productService.getProducts().then((data) => {
            if (active) {
                setProducts(data || []);
            }
        }).catch(() => {
            if (active) {
                setProducts([]);
            }
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let scanner;
        let stopped = false;
        const start = async () => {
            scanner = new Html5Qrcode("roach-qr-reader");
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 220 },
                    (decoded) => {
                        const id = productIdFromScan(decoded);
                        if (!id || handled.current) {
                            return;
                        }
                        handled.current = true;
                        scanner.stop().catch(() => {}).finally(() => {
                            navigate(`/stock/${id}`);
                        });
                    }
                );
            } catch (error) {
                if (!stopped) {
                    setCameraNote("Camera isn't available. Search for a product instead.");
                }
            }
        };
        start();
        return () => {
            stopped = true;
            if (scanner) {
                scanner.stop().catch(() => {});
            }
        };
    }, [navigate]);

    const filtered = products.filter((product) => {
        const haystack = `${product.name} ${product.sku}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
    });

    return (
        <div className="shop-page">
            <h3 className="--mt">Scan</h3>
            <p>Point the camera at a Roach product QR, or search by name or SKU.</p>
            {cameraNote && <p>{cameraNote}</p>}
            <div id="roach-qr-reader"></div>
            <input
                type="text"
                placeholder="Search name or SKU"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <table className="shop-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>On hand</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.quantity}</td>
                            <td><button type="button" className="--btn --btn-primary" onClick={() => navigate(`/stock/${product._id}`)}>Open</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Scan;
