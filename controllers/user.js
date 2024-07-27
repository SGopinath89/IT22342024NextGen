const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;
        
        if (!name || !email || !password || !confirm_password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await User.findOne({ email: email })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.redirect('/login.html');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        });

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error:  error.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });

    res.redirect('/index.html');
};
