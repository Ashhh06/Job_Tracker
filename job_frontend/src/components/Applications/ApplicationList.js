import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';
import ApplicationForm from './ApplicationForm';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        jobType: '',
        search: ''
    });

    useEffect(() => {
        fetchApplications();
    }, [filters]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.jobType) params.jobType = filters.jobType;
            if (filters.search) params.search = filters.search;

            const response = await applicationsAPI.getAll(params);
            setApplications(response.data.data);
        } catch (error) {
            console.error('Error fetching applications: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) {
            return;
        }

        try {
            await applicationsAPI.delete(id);
            fetchApplications();
        } catch (error) {
            console.error('Error deleting application: ', error);
            alert('Failed to delete application');
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setShowForm(true);
    };

    const handleFormClose = (app) => {
        setShowForm(false);
        setEditingApp(null);
        fetchApplications();
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="applications-container">
            <div className="page-header">
                <h1>My Applications</h1>
                <button onClick={() => setShowForm(true)} className="button primary">
                    + Add Application
                </button>
            </div>

            <div className="filters-card">
                <div className="filter-group">
                    <label>Search</label>
                    <input
                        type="text"
                        name="search"
                        placeholder="Company or position..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="input"
                    />
                </div>

                <div className="filter-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="select"
                    >
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Job Type</label>
                    <select
                        name="jobType"
                        value={filters.jobType}
                        onChange={handleFilterChange}
                        className="select"
                    >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : applications.length === 0 ? (
                <div className="empty-state-card">
                    <p>No applications found.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="button primary"
                    >
                        Add Your First Application
                    </button>
                </div>
            ) : (
                <div className="table-card">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td className="company-name">{app.companyName}</td>
                                    <td className="job-title">{app.jobTitle}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>{app.jobType || 'N/A'}</td>
                                    <td className="date">
                                        {new Date(app.applicationDate).toLocaleDateString()}
                                    </td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleEdit(app)}
                                            className="button-link"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app._id)}
                                            className="button-link delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showForm && (
                <ApplicationForm
                    application={editingApp}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
};

export default ApplicationList;