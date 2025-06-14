import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/authContex'
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Yourblogs = () => {

  const { getUserId } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const port = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();

  const fetchUserBlogs = useCallback(async () => {

    try {
      const userId = await getUserId();
      // console.log('User ID:', userId);

      const res = await fetch(`${port}/blog/yourblogs/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // console.log('Fetched blogs:', data);
        setBlogs(data);
        setError('');
      } else {
        setBlogs([]);
        setError(data?.message || 'Failed to fetch blogs.');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Something went wrong while fetching your blogs.');
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  return (
    
    <div className="min-h-screen py-10 px-4 flex flex-col my-9 md:my-0 items-center bg-gray-50">
      <h1 className="md:text-4xl text-2xl font-bold mb-9"><u>Your Blogs</u></h1>

      {loading ? (
        <div className="text-gray-500">Loading your blogs...</div>
      ) : error && blogs.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/blog/create')}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 cursor-pointer h-14 text-lg transition"
          >
            Create Your First Blog
          </button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">You haven't written any blogs yet.</p>
          <button
            onClick={() => navigate('/blog/create')}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 cursor-pointer h-14 text-lg transition"
          >
            Create Your First Blog
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {blogs.map((blog, idx) => (
            <Card key={idx} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Yourblogs


