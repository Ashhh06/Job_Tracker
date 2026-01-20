exports.errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    //mongoose bad ObjectId
    if(err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    //mongoose duplicate key
    if(err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    //mongoose validation error
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = { message, statusCode : 400 };
    }

    // JWT errors
    if(err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if(err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    });
};