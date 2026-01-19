const mongoose = require('mongoose');
const Application = require('../models/Application');

//get all applications for logged in user
//GET /api/applications
exports.getApplications = async  (req, res, next) => {
    try {
        //filter by user
        let query = { user: req.user.id };

        //filtering by status
        if(req.query.status) {
            query.status = req.query.status;       
        }

        //filtering by jobType
        if(req.query.jobType) {
            query.jobType = req.query.jobType;
        }

        //search by company name or job title
        if(req.query.search) {
            query.$or = [
                { companyName: { $regex: req.query.search, $options: 'i' } },
                { jobTitle: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        //sorting (default: newest first)
        const sortBy = req.query.sortBy || '-applicationDate';

        const applications = await Application.find(query)
            .sort(sortBy)
            .select('-__v');

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

//get single appliation
//GET /api/applications/:id
exports.getApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        //check if application exists
        if(!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        //make sure user owns the application
        if(application.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this application",
            });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};



//create new application
//POST /api/applications
exports.createApplication = async (req, res, next) => {
    try {
        //add user to req.body
        req.body.user = req.user.id;

        const application = await Application.create(req.body);

        res.status(201).json({
            success: true,
            data: application,
        });
    } catch(error) {
        next(error);
    }
}



//update application
//PUT /api/applications/:id
exports.updateApplication = async (req, res, next) => {
    try {
        let application = await Application.findById(req.params.id);

        //check if application exists
        if (!application) {
            return res.status(404).json({
              success: false,
              message: 'Application not found',
            });
        }

        //make sure user owns the application
        if (application.user.toString() !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: 'Not authorized to update this application',
            });
        }

        //update application
        application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
}



//delete application
//DELETE /api/applications/:id
exports.deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        //check if application exists
        if (!application) {
            return res.status(404).json({
              success: false,
              message: 'Application not found',
            });
        }

        //make sure user owns application
        if (application.user.toString() !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: 'Not authorized to delete this application',
            });
        }

        await application.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Application deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};



//get statistics for logged in user
//GET /api/applications/stats
exports.getStats = async (req, res, next) => {
    try { 
        const userId = req.user.id;

        //total applications
        const total = await Application.countDocuments({ user: userId });

        //applications by status
        const byStatus = await Application.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 },
            } }
        ]);

        //applications by job type
        const byJobType = await Application.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: '$jobType',
                count: { $sum: 1 },
            }, },
        ]);

        //recent applications (last 30 days) 
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recent = await Application.countDocuments({
            user: userId,
            applicationDate: { $gte: thirtyDaysAgo },
        });


        //response rate(if status is not "Applied")
        const responded = await Application.countDocuments({
            user: userId,
            status: { $ne: 'Applied' },
        });
        const responseRate = total > 0 ? ((responded / total) * 100).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                total,
                byStatus: byStatus.reduce((acc, item) => {
                    acc[item._id || 'N/A'] = item.count;
                    return acc;
                }, {}),
                byJobType: byJobType.reduce((acc, item) => {
                    acc[item._id || 'N/A'] = item.count;
                    return acc;
                }, {}),
                recent,
                responseRate: parseFloat(responseRate),
            },
        });
    } catch (error) {
        next(error);
    }
};