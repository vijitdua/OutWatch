import rateLimit from 'express-rate-limit';

// 20 requests per 15 minutes
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const messageRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    }
})

// 100 requests per minute
export const globalRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
