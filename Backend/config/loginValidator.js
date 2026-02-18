import validator from 'validator';

const loginSchema = ({ email, password }) => {
    if (!email || !password) {
        return 'Email and password are required';
    }

    if (!validator.isEmail(email)) {
        return 'Enter a valid email';
    }

    if (password.length < 8) {
        return 'Invalid credentials';
    }

    return null; // no error
};

export default loginSchema;

