import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import multer from 'multer';

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRouter.js';
import appointmentRouter from './routes/AppointmentRouter.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app = express();
const port = 4000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

// Middleware
app.use(cors({
    origin: (origin, callback) => {

        if (!origin) return callback(null, true);

        if (allowedOrigins.some(o => o === origin.trim())) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(clerkMiddleware());
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// DB
connectDB();

// Routes
app.use('/api/doctors', doctorRouter);
app.use('/api/services', serviceRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/service-appointments', serviceAppointmentRouter);

app.use('/', (req, res) => {
    res.send('API WORKING');
});

// Central error handler
app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error',
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});