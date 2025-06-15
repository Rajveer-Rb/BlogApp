import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/authContex'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const { getUserId } = useAuth();
  const [user, setUser] = useState({ name: '', username: '', email: '', profilepic: null, about: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [message, setMessage] = useState("")
  const navigate = useNavigate();
  const port = import.meta.env.VITE_SERVER_URL;

  const fetchUser = useCallback(async () => {

    try {
      const userId = await getUserId();
      // console.log('User ID:', userId);

      const res = await fetch(`${port}/user/dashboard/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: 'Access-Control-Allow-Origin',
      });

      const data = await res.json();

      if (res.ok) {
        // console.log('Fetched user:', data);
        setUser({ name: data.fullname, username: data.username, email: data.email, profilepic: data.profilepic, about: data.about });
        setError('');
      } else {
        setError(data?.message || 'Failed to fetch user info.');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Something went wrong while fetching logged in user.');
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = async (e) => {

    setMessage('');

    const { name, value, files } = e.target;

    if (name == 'profilepic') {
      setUser({ ...user, profilepic: files[0] });
    }
    else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  }

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("username", user.username);
    formData.append("profilepic", user.profilepic);
    formData.append("about", user.about);

    try {
      const res = await fetch(`${port}/user/dashboard/update`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: 'Access-Control-Allow-Origin',
      });

      const data = await res.json();

      if (res.ok) {
        alert('user updated sucessfully');
        // console.log('updated user', data);
        navigate('/user/profile');
      }
      else {
        // alert(data.message || 'cant update uesr');
        setMessage(data.message);
      }
    } catch (error) {
      console.error('error updating user', error);
      // alert('error updating uesr');
    }
  }

  return (
    <>
      <div className='min-h-screen p-4' style={{
        backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
      }}>

        <h1 className='text-center font-bold text-2xl mb-5'>Welcome to your Dashboard</h1>
        <div className="inputs flex flex-col md:justify-center items-center md:w-[40%] w-full md:h-full m-auto my-2 md:bg-gray-400 rounded-md p-3">

          <div className='my-1 flex flex-col gap-1 w-full'>
            <label htmlFor="name" className='text-sm font-bold'>Name</label>
            <input name="name" value={user.name} type="text" className='p-2 rounded-lg bg-slate-600 text-white' />
          </div>

          <div className='my-1 flex flex-col gap-1 w-full'>
            <label htmlFor="username" className='text-sm font-bold'>Username</label>
            <input onChange={handleChange} name="username" value={user.username} type="text" className='p-2 rounded-lg bg-slate-600 text-white' />

            {message && (
              <p className="text-sm text-red-500 mt-1">{message}</p>
            )}
          </div>

          <div className='my-1 flex flex-col gap-1 w-full'>
            <label htmlFor="mail" className='text-sm font-bold'>Email</label>
            <input name="email" value={user.email} id='email' type="email" className='p-2 rounded-lg bg-slate-600 text-white' />
          </div>

          <div className='my-1 flex flex-col gap-1 w-full'>
            <label htmlFor="profilePic" className='text-sm font-bold'>Profile picture</label>
            <input onChange={handleChange} name="profilepic" type="file" className='p-2 rounded-lg bg-slate-600 text-white' />
          </div>

          <div className='my-1 flex flex-col gap-1 w-full'>
            <label htmlFor="about" className='text-sm font-bold'>Description</label>
            {/* <input onChange={handleChange} value={user.about} name="about" type="text" className='p-2 rounded-lg bg-slate-600 text-white' /> */}
            <textarea onChange={handleChange} value={user.about} name="about" type="text" className='p-2 rounded-lg bg-slate-600 text-white' placeholder='describe yourself in short'></textarea>
          </div>

          <div className='btn my-4 w-full'>
            <button onClick={handleSubmit} className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">Save</button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard
