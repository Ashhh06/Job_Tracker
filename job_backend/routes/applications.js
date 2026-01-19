const express = require('express');
const router = express.Router();
const {
    getApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    getStats,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');


router.use(protect); //all routes are protected

router.route('/').get(getApplications).post(createApplication);
router.route('/stats').get(getStats);
router
    .route('/:id')
    .get(getApplication)
    .put(updateApplication)
    .delete(deleteApplication);

module.exports = router;