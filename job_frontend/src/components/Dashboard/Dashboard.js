import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentApps, setRecentApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
          const [statsRes, appsRes] = await Promise.all([
            applicationsAPI.getStats(),
            applicationsAPI.getAll({ sortBy: '-applicationDate' }),
          ]);
    
          setStats(statsRes.data.data);
          setRecentApps(appsRes.data.data.slice(0, 5)); //we get latest 5
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
    };
    
    if(loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1> Welcome back, {user?.name}! </h1>
                <p className="subtitle">Here's your job application overview</p>
            </div>

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Applications</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Interviews</div>
                        <div className="stat-value">{stats.byStatus?.Interview || 0}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Offers</div>
                        <div className="stat-value">{stats.byStatus?.Offer || 0}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Response Rate</div>
                        <div className="stat-value">{stats.responseRate}%</div>
                    </div>
                </div>
            )}

            <div className="recent-applications-card">
                <div className="card-header">
                    <h2>Recent Applications</h2>
                    <Link to="/applications" className="view-all-link">
                        View All →
                    </Link>
                </div>
                {recentApps.length === 0 ? (
                    <div className="empty-state">
                        <p>No applications yet.</p>
                        <Link to="/applications" className="button primary">
                            Add Your First Application
                        </Link>
                    </div>
                ) : (
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentApps.map((app) => (
                                <tr key={app._id}>
                                    <td className="company-name">{app.companyName}</td>
                                    <td className="job-title">{app.jobTitle}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="date">
                                        {new Date(app.applicationDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
};

export default Dashboard;