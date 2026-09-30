import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import InfoBox from "../../components/infoBox/InfoBox";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { getReport, messageFrom } from "../../services/shopService";
import { formatNumbers } from "../../components/product/productSummary/ProductSummary";
import "../../components/product/productSummary/ProductSummary.scss";
import "../shop/shop.scss";

const money = (value) => `₹${formatNumbers(value || 0)}`;

const Reports = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        getReport().then(setReport).catch((error) => toast.error(messageFrom(error)));
    }, []);

    if (!report) {
        return <p className="--mt">Loading reports...</p>;
    }

    return (
        <div>
            <h3 className="--mt">Reports</h3>
            <div className="info-summary">
                <InfoBox icon={<BsCart4 size={40} color="#fff" />} title="Units sold" count={report.unitsSold} bgColor="card1" />
                <InfoBox icon={<AiFillDollarCircle size={40} color="#fff" />} title="Revenue" count={money(report.revenue)} bgColor="card2" />
                <InfoBox icon={<AiFillDollarCircle size={40} color="#fff" />} title="Cost" count={money(report.cost)} bgColor="card3" />
                <InfoBox icon={<AiFillDollarCircle size={40} color="#fff" />} title="Profit" count={money(report.profit)} bgColor="card4" />
            </div>

            <h4>Invoices</h4>
            <table className="shop-table">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>When</th>
                        <th>Revenue</th>
                        <th>Profit</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {report.invoices.map((invoice) => (
                        <tr key={invoice._id}>
                            <td>{invoice.number}</td>
                            <td>{new Date(invoice.createdAt).toLocaleString()}</td>
                            <td>₹{invoice.subtotal}</td>
                            <td>₹{invoice.profit}</td>
                            <td><Link to={`/invoice/${invoice._id}`}>Open</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Stock movements</h4>
            <table className="shop-table">
                <thead>
                    <tr>
                        <th>When</th>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Change</th>
                        <th>After</th>
                    </tr>
                </thead>
                <tbody>
                    {report.movements.map((movement) => (
                        <tr key={movement._id}>
                            <td>{new Date(movement.createdAt).toLocaleString()}</td>
                            <td>{movement.productName}</td>
                            <td>{movement.type}</td>
                            <td>{movement.quantityChange}</td>
                            <td>{movement.quantityAfter}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
