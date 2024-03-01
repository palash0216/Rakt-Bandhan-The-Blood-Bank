import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../services/api';
import Layout from '../components/shared/Layout/Layout';
import moment from 'moment';
import "../index.css";
import InputType from '../components/shared/Form/InputType';

const Donation = () => {
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [donorName, setDonorName] = useState('');
    const requestType = "donate";
    const [donorEmail, setDonorEmail] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [organisations, setOrganisations] = useState([]);

    const getDonars = async () => {
        try {
            const { data } = await API.post("/inventory/get-inventory-hospital", {
                filters: {
                    inventoryType: "in",
                    donar: user?._id,
                },
            });
            if (data?.success) {
                setData(data?.inventory);
                console.log("donar data : ", data.inventory);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOrganisations = async () => {
        try {
            const { data } = await API.get("/inventory/get-all-organisations");
            console.log("org data: ", data.organisations);
            if (data?.success) {
                setOrganisations(data?.organisations);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleDonationSubmit = async () => {
        try {
            if (!donorName || !donorEmail || !donorPhone || !bloodGroup) {
                return alert("Please provide all donor details");
            }
            console.log("reuqst : ",requestType);
            const { data } = await API.post("/inventory/submit-donation", {
                requestType,
                donorName,
                donorEmail,
                donorPhone,
                bloodGroup,
                organisation,
            });
            console.log("donation status : ", data);
            if (data?.success) {
                alert("Donation details submitted successfully!");
                window.location.reload();
                setShowForm(false);
                // getDonars();  

            }
        } catch (error) {
            console.log(error);
            alert("Error submitting donation details. Please try again.");
        }
    };
    useEffect(() => {
        getOrganisations();
        getDonars();
    }, []);
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className='ms-0' style={{ fontWeight: "bold", paddingLeft: "9px" }}>
                    <i className="fa-solid fa fa-handshake text-success py-4"></i>
                    Donation Page
                </h4>

                <button
                    className="btn btn-success"
                    onClick={() => setShowForm(true)}
                >
                    Donate Blood
                </button>
            </div>


            {showForm && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Donate Blood Request</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowForm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className='d-flex' >
                                    {/* Blood Type Radio Buttons */}
                                </div>
                                <InputType
                                    labelText="Donor Name"
                                    labelFor="donorName"
                                    inputType="text"
                                    placeholder="Enter donor name"
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                />

                                <InputType
                                    labelText="Donor Email"
                                    labelFor="donorEmail"
                                    inputType="email"
                                    placeholder="Enter donor email"
                                    value={donorEmail}
                                    onChange={(e) => setDonorEmail(e.target.value)}
                                />

                                <InputType
                                    labelText="Donor Phone"
                                    labelFor="donorPhone"
                                    inputType="tel"
                                    placeholder="Enter donor phone"
                                    value={donorPhone}
                                    onChange={(e) => setDonorPhone(e.target.value)}
                                />

                                <InputType
                                    labelText="Donor Blood Group"
                                    labelFor="bloodGroup"
                                    inputType="text"
                                    placeholder="Enter donor blood Group"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                />

                                <div className='form-group'>
                                    <label htmlFor="organisation" className="form-label" style={{ fontWeight: "bold" }}>
                                        Select Organisation
                                    </label>
                                    <select
                                        id="organisation"
                                        className="form-select input-type-color"
                                        value={organisation}
                                        onChange={(e) => setOrganisation(e.target.value)}
                                        style={{ backgroundColor: "#e7ffff", border: "1px solid black" }}
                                        >
                                        <option value="">Select an organisation</option>
                                        {organisations.map((org) => (
                                            <option key={org._id} value={org._id}>
                                                {org.organisationName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleDonationSubmit}>Submit Donation</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginLeft: "10px", marginRight: "40px" }}>
                <table className="table table-info table-striped tableClass">
                    <thead>
                        <tr className="table-warning" style={{ border: "1px solid gray" }}>
                            <th scope="col">Blood Group</th>
                            <th scope="col">Inventory Type</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Email</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((record) => (
                            <tr key={record._id}>
                                <td>{record.bloodGroup}</td>
                                <td>{record.inventoryType}</td>
                                <td>{record.quantity}</td>
                                <td>{record.email}</td>
                                <td>{moment(record.createdAt).format("DD/MM/YYYY A")}</td>
                                <td>{record.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Donation;
