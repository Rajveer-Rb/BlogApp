import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContex';


const Blog = () => {

    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState({ comment: "" });
    const [comments, setComments] = useState([]);
    const port = import.meta.env.VITE_SERVER_URL;

    const navigate = useNavigate();

    useEffect(() => {

        const fetchBlog = async () => {

            try {
                const res = await fetch(`${port}/blog/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                })

                const data = await res.json();
                // console.log('fetced blog', data);

                if (res.ok) {
                    // console.log('blog fetced successfully');
                    setBlog(data.blog);
                    setComments(data.comments);
                }
                // else {
                //     console.log('frontend error: cant fetch this blog');
                // }
            } catch (error) {
                console.error('cant fetch this blog- frontend');
            }
        }
        fetchBlog();
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;

    if (!blog) return <p>Loading...</p>; // loading UI until blog is fetched

    const handleChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {

        try {
            const res = await fetch(`${port}/blog/comment/${blog._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ comment: comment.comment })
            });

            const body = await res.json();

            if (res.ok) {
                setComment({ comment: '' });

                // Refetch comments to get populated createdBy.fullname
                const refreshed = await fetch(`${port}/blog/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await refreshed.json();
                if (refreshed.ok) {
                    setComment({ comment: "" });
                    setComments(data.comments);
                    navigate(`/blog/${id}`);
                }
            }
            else {
                console.log('error posting comment');
            }
        } catch (error) {
            console.error('error posting comment via frontend', error);
        }
    }

    return (
        <div className='container flex flex-col items-start gap-10 py-8 px-8 bg-gray-50 h-full'>

            <div className='h-[60%] md:w-[50%] w-full'>

                <u><h1 className='font-bold md:text-4xl text-3xl'>{blog.title}</h1></u>
                <img src={`${port}/${blog.coverImgUrl}`} className='md:h-[400px] h-[300px] w-full rounded-md md:mt-3 mt-6' alt={blog.title} />
            </div>
            <div className="w-full mt-6 rounded-md h-fit">
                <p className="text-lg md:min-h-[20vh] text-justify leading-relaxed bg-gray-300 text-black p-2 ">
                    {blog.body}
                </p>
                <h1 className='font-semibold text-2xl mt-3'>Author: {blog.createdBy.fullname}</h1>
            </div>

            {isAuthenticated &&
                <div className="commentInput flex flex-col gap-2 w-full">
                    <input value={comment.comment} onChange={handleChange} type="text" name='comment' id='comment' placeholder='write your comments here...' className='w-full p-1 border-2 border-gray-300 rounded-md' />
                    <button onClick={handleSubmit} className='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer w-[100px]'>Post</button>
                </div>
            }

            <div className="comments w-full">

                <h1 className='font-bold md:text-4xl text-xl'>{`Comments(${comments.length})`}</h1>

                {comments.length === 0 && (
                    <p className="text-gray-500">No comments yet.</p>
                )}

                {comments.map((comm, idx) => (
                    <div
                        key={idx}
                        className="commentBox border border-gray-300 shadow-sm bg-white w-full my-4 p-2 rounded-xl transition-all hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className='flex gap-1'>
                                <img className='h-6' src="/profile.gif" alt="img" />
                            <h1 className="text-purple-700 font-semibold text-lg">
                                {comm.createdBy?.fullname || 'Anonymous'}
                            </h1>
                            </span>
                            <span className="text-sm text-gray-400">{`#${idx + 1}`}</span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed">
                            {comm.content}
                        </p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Blog
