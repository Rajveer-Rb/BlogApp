const { Router } = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const multer = require('multer');
const path = require('path');
const router = Router();

// console.log('blog route loaded')

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

router.post('/create', upload.single("coverImage"), async (req, res) => {

    const { title, content } = req.body;

    const body = await Blog.create({
        title: title,
        body: content,
        coverImgUrl: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    });

    return res.status(200).json({ message: 'blog created successfully', body });
})

router.get('/', async (req, res) => {

    try {
        const blogs = await Blog.find();
        // if (blogs === 0) {
        //     console.log('blog section is empty create a new one');
        // }
        return res.status(200).json(blogs);
    } catch (error) {
        console.error('error fetching blogs in backend', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:id', async (req, res) => {

    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

        return res.status(200).json({ blog, comments });
    } catch (error) {
        console.error('error fetching this blog!, try again later');
        return res.status(500).json({ error: 'Internal server error while fetching this blog' });
    }
})

router.post('/comment/:id', async (req, res) => {

    // console.log(req.params.id);
    // console.log(req.user._id);

    try {
        // const commenter = await User.findById(req.user._id);
        // console.log('commenter', commenter.fullname);
        const savedComment = await Comment.create({
            content: req.body.comment,
            blogId: req.params.id,
            createdBy: req.user._id,
            // commentor: commenter.fullname,
        });

        // return res.status(200).json({'comment saved successfully': savedComment});
        await savedComment.populate('createdBy', 'fullname');
        return res.status(200).json({ 'message': savedComment });

    } catch (error) {
        return res.status(500).json({ 'couldnt save comment error from backend': error });
    }
})

router.get('/yourblogs/:id', async (req, res) => {

    // console.log(req.params.id);
    try {
        // const userId = new mongoose.Types.ObjectId(req.params.id);
        // const blogs = await Blog.find({ createdBy: userId });
        const userId = req.params.id;
        const blogs = await Blog.find({createdBy: userId})
        if (blogs.length === 0) {
            return res.status(404).json({ 'message': 'you havent created any blogs yet' });
        }

        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(500).json({ 'error from backend while fetching your blogs': error })
    }
})

module.exports = router;
