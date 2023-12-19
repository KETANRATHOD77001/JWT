const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/JWT');
        console.log(`Connected to mongodb database ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in Mongodb ${error}`);
    }
};

connectDB();

// Create User model
const User = mongoose.model('User', {
    username: String,
    password: String,
});

app.use(bodyParser.json());

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = new User({
        username,
        password: hashedPassword,
    });

    await user.save();

    res.json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json({ message: 'Protected route accessed', user });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
