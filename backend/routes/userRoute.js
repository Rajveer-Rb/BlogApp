const { Router } = require('express');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage });

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const currUser = await User.find({ email: email });

        const token = await User.matchPasswordAndGenerateToken(email, password);
        // console.log('generated token:', token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days validity
        });

        res.status(200).json({ 'createdUser:': currUser });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({
            message: 'Signin error',
            realError: error.message,      // send real reason to frontend (for debugging)
        });
    }
})

router.post('/signup', async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await User.create({
            fullname: username,
            email: email,
            password: password,
        });
        return res.status(200).json({ message: 'user created successfully' });
    } catch (error) {
        console.error('Error in signup route:', error);
        // return res.status(500).json({ message: 'Signup error' });
        return res.status(500).json({
            message: 'Signup error',
            realError: error.message,      // send real reason to frontend (for debugging)
        });
    }
})

router.post('/logout', (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error loggin out:', error);
        return res.status(500).json({
            message: 'Logut error',
            realError: error.message,      // send real reason to frontend (for debugging)
        });
    }
})

router.get('/dashboard/:id', async (req, res) => {

    // console.log(req.params.id);

    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ 'error fetching user': error });
    }
})

router.post('/dashboard/update', upload.single("profilepic"), async (req, res) => {

    // console.log(req.file.filename);

    try {
        const { name, username, email, about } = req.body;

        if (!name || !username || !email) {
            return res.status(400).json({ message: 'invalid credentials' });
        }

        if (username !== name) {

            let u = await User.findOne({ username: username });
            if (u) {
                return res.status(400).json({ message: 'username not available' });
            }

            const updateData = { username, about };

            // Only add profilepic if file exists
            if (req.file) {
                updateData.profilepic = `/uploads/${req.file.filename}`;
            }
            const updatedUser = await User.updateOne({ email: email }, updateData, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            // console.log('updated user', updatedUser);
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.error('Update error from backend:', error);
        res.status(500).json({ error: 'Interval Server error' });
    }
})



module.exports = router;