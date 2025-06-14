"use client"
import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/authContex'
import { Link } from 'react-router-dom'

const Profile = () => {

    const { getUserId } = useAuth();
    const [user, setUser] = useState({ name: '', username: '', profilepic: '', about: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const port = import.meta.env.VITE_SERVER_URL;

    const fetchUser = useCallback(async () => {

        try {
            const userId = await getUserId();
            // console.log('User ID:', userId);

            const res = await fetch(`${port}/user/dashboard/${userId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Fetched user:', data);
                setUser({ name: data.fullname, username: data.username, profilepic: data.profilepic, about: data.about });
                setError('');
            } else {
                setError(data?.message || 'Failed to fetch blogs.');
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

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

                <span className='flex justify-end'><Link to='/user/dashboard'><img className='h-7 cursor-pointer' src="/edit.png" alt="" /></Link></span>
                <div className="flex justify-center mb-4">
                    <img
                        src={user.profilepic ? `${port}/${user.profilepic}` : '/profile.gif'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                    />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-1">About</h3>
                    <p className="text-gray-600 text-sm">{user.about ? user.about : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
