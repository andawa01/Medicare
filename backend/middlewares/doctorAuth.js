import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    //Check token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Doctor not authorized, no token.",
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const payload = jwt.verify(token, JWT_SECRET);

        if (payload.role && payload.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not a doctor.",
            });
        }

        // Find doctor by ID
        const doctor = await Doctor.findById(payload.id).select('-password');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        // Attach doctor to request object
        req.doctor = doctor;
        next();

    } catch (error) {
        console.error('Doctor JWT Verification failed:', error);
        return res.status(401).json({
            success: false,
            message: "Token invalid or missing or expired.",
        });
    }

}