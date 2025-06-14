import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Create = () => {

    const [blogDetails, setBlogDetails] = useState({ coverImage: null, title: "", content: "" });
    const port = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {

        // setBlogDetails({...blogDetails, [e.target.name]: e.target.value});
        setError('');
        const { name, value, files } = e.target;

        if (name === "coverImage") {
            setBlogDetails({ ...blogDetails, coverImage: files[0] });
        } else {
            setBlogDetails({ ...blogDetails, [name]: value });
        }
    }

    const handleSubmit = async () => {

        if (!blogDetails.coverImage || !blogDetails.title || !blogDetails.content) {
            setError('inputs cant be empty!');
            return;
        }

        const formData = new FormData();
        formData.append("coverImage", blogDetails.coverImage);
        formData.append("title", blogDetails.title);
        formData.append("content", blogDetails.content);

        try {
            const response = await fetch(`${port}/blog/create`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await response.json();
            // console.log(data);

            if (response.ok) {
                // console.log('blog created successfully');
                navigate('/');
            }
        } catch (error) {
            console.error('blog creation error', error);
        }
    }

    return (

        <div className="flex flex-col items-center gap-3 w-full min-h-screen"
            style={{
                backgroundImage: 'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)',
            }}>

            <h1 className='mt-10 text-2xl font-bold'>Create a new Blog</h1>

            <div className='flex flex-col gap-3 w-[80%]'>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="coverImage">Cover Image</label>
                    <input onChange={handleChange} name='coverImage' id='coverImage' type="file" placeholder='add cover image for your blog' className='border-2 border-gray-400 rounded-sm p-1' />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="title">Title</label>
                    <input onChange={handleChange} name='title' id='title' type="text" placeholder='title of your blog' className='border-2 border-gray-400 rounded-sm p-1' />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="content">Description</label>
                    <textarea onChange={handleChange} name='content' id='content' type="text" placeholder='enter context' className='border-2 border-gray-400 rounded-sm p-1 h-[40vh]'></textarea>
                </div>

                {error && <p className='text-red-500 text-sm'>{error}</p>}

                <button onClick={handleSubmit} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer w-fit">Create</button>

            </div>
        </div>
    )
}

export default Create
