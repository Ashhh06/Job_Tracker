import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import { APPLICATION_STATUS, JOB_TYPES } from '../../utils/constants';

const ApplicationForm = ({ application, onClose }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        salary: '',
        location: '',
        jobType: '',
        source: '',
        notes: '',
        deadline: '',
        contactEmail: '',
        tags: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName || '',
                jobTitle: application.jobTitle || '',
                jobDescription: application.jobDescription || '',
                applicationDate: application.applicationDate
                    ? new Date(application.applicationDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                status: application.status || 'Applied',
                salary: application.salary || '',
                location: application.location || '',
                jobType: application.jobType || '',
                source: application.source || '',
                notes: application.notes || '',
                deadline: application.deadline
                    ? new Date(application.deadline).toISOString().split('T')[0]
                    : '',
                contactEmail: application.contactEmail || '',
                tags: application.tags?.join(', ') || '',
            });
        }
    }, [application]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                salary: formData.salary ? Number(formData.salary) : undefined,
                tags: formData.tags
                    ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                    : [],
            };

            if (application) {
                await applicationsAPI.update(application._id, dataToSubmit);
            } else {
                await applicationsAPI.create(dataToSubmit);
            }

            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to save application'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{application ? 'Edit Application' : 'Add New Application'}</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Job Title *</label>
                            <input
                                type="text"
                                name="jobTitle"
                                required
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="select"
                            >
                                {APPLICATION_STATUS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="">Select...</option>
                                {JOB_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Application Date *</label>
                            <input
                                type="date"
                                name="applicationDate"
                                required
                                value={formData.applicationDate}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Source</label>
                            <input
                                type="text"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                placeholder="LinkedIn, Indeed, etc."
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            name="jobDescription"
                            rows="4"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            className="textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            className="textarea"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="remote, startup, tech"
                            className="input"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="button secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="button primary"
                        >
                            {loading ? 'Saving...' : application ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;