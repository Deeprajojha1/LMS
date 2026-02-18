import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ['student', 'educator'],
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    photoUrl: {
        type: String,
        trim: true,
        default: ''
    },

    enrollmentCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    resetOtp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    isOtpVerifed:{
        type:Boolean,
        default:false
    }

},
{
    timestamps: true
}
);

const User = mongoose.model('User', userSchema);
export default User;