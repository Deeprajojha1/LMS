import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getToken = async (userId) => {
    try {
        const token = await jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // console.log(token);
        return token;   //  MISSING PART

    } catch (error) {
        console.error('JWT Token Error:', error.message);
        throw error;   //  propagate error
    }
};

export default getToken;
