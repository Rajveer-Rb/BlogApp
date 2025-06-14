const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const {connectDB} = require('./connection')
const {checkAuthCookie} = require('./middlewares/auth')
const { error } = require('console')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

const userRoute = require('./routes/userRoute')
const blogRoute = require('./routes/blogRoute')
const app = express()
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URI;

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://blog-app-8wi9-git-main-rajveers-projects-80645a24.vercel.app/',
    credentials: true,
}))

connectDB(mongoUrl).then(console.log('connected to Database')).catch((err) => {})

app.use(express.static(path.resolve("./public")))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(checkAuthCookie("token"))

app.get('/', (req,res) => {
    res.json({success: "true"})
})

app.get('/api/auth/verify', (req,res) => {

  const token = req.cookies.token; 

  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, 'notAteenAnymore@2005');
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

app.get('/api/auth/getuserid', (req,res) => {

  const token = req.cookies.token;

  if(!token) return res.json({'message from backend': 'cant fetch user id'});

  try {
    const payload = jwt.verify(token, 'notAteenAnymore@2005');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('error while fetching id from backend', error);
    return res.status(500).json({'message': 'cant fetch user id'});
  }
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(port, (req,res) => {
    console.log(`server running at port: ${port}`);
})