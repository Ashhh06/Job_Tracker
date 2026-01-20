import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await applicationsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="analytics-container">
        <p>No data available</p>
      </div>
    );
  }

  // Calculate percentages for status breakdown
  const statusPercentages = {};
  if (stats.total > 0 && stats.byStatus) {
    Object.keys(stats.byStatus).forEach((status) => {
      statusPercentages[status] = (
        (stats.byStatus[status] / stats.total) *
        100
      ).toFixed(1);
    });
  }

  // Calculate percentages for job type breakdown
  const jobTypePercentages = {};
  const totalJobTypes = Object.values(stats.byJobType || {}).reduce(
    (sum, count) => sum + count,
    0
  );
  if (totalJobTypes > 0 && stats.byJobType) {
    Object.keys(stats.byJobType).forEach((type) => {
      jobTypePercentages[type] = (
        (stats.byJobType[type] / totalJobTypes) *
        100
      ).toFixed(1);
    });
  }

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>
      <p className="subtitle">Insights into your job application journey</p>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Response Rate</div>
          <div className="stat-value">{stats.responseRate}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Recent (Last 30 Days)</div>
          <div className="stat-value">{stats.recent}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="analytics-card">
        <h2>Applications by Status</h2>
        {stats.byStatus && Object.keys(stats.byStatus).length > 0 ? (
          <div className="breakdown-list">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="breakdown-item">
                <div className="breakdown-header">
                  <span className={`status-badge status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                  <span className="breakdown-count">{count}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${statusPercentages[status] || 0}%`,
                      backgroundColor:
                        status === 'Offer'
                          ? '#10b981'
                          : status === 'Interview'
                          ? '#f59e0b'
                          : status === 'Rejected'
                          ? '#ef4444'
                          : '#3b82f6',
                    }}
                  ></div>
                </div>
                <div className="breakdown-percentage">
                  {statusPercentages[status] || 0}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No status data available</p>
        )}
      </div>

      {/* Job Type Breakdown */}
      {stats.byJobType && Object.keys(stats.byJobType).length > 0 && (
        <div className="analytics-card">
          <h2>Applications by Job Type</h2>
          <div className="breakdown-list">
            {Object.entries(stats.byJobType).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="job-type-label">{type || 'Not Specified'}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${jobTypePercentages[type] || 0}%`,
                    }}
                  ></div>
                </div>
                <div className="breakdown-percentage">
                  {jobTypePercentages[type] || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Section */}
      <div className="analytics-card insights-card">
        <h2>Insights</h2>
        <ul className="insights-list">
          <li>
            You've applied to <strong>{stats.total}</strong> positions
          </li>
          <li>
            Your response rate is <strong>{stats.responseRate}%</strong>
          </li>
          {stats.byStatus?.Interview > 0 && (
            <li>
              You have <strong>{stats.byStatus.Interview}</strong> interview{stats.byStatus.Interview > 1 ? 's' : ''}
            </li>
          )}
          {stats.byStatus?.Offer > 0 && (
            <li>
              You received <strong>{stats.byStatus.Offer}</strong> offer{stats.byStatus.Offer > 1 ? 's' : ''}!
            </li>
          )}
          {stats.recent > 0 && (
            <li>
              You've applied to <strong>{stats.recent}</strong> positions in the last 30 days
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;