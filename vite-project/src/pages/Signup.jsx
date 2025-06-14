import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'

const Signup = () => {

  const navigate = useNavigate();

  const [creds, setCreds] = useState({ username: "", email: "", password: "" });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [error, setError] = useState("");
  const port = import.meta.env.VITE_SERVER_URL;
  const notify = () => toast("Signed up successfully!");

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      setIsPasswordValid(passwordRegex.test(value));
    }

    setCreds({ ...creds, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {

    try {
      const response = await fetch(`${port}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(creds),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setCreds({ username: "", email: "", password: "" })
        navigate('/user/login');
        notify();
        // console.log('signup successfull')
      }
      else {
        // console.log('signup failed');
        // console.log('signup failed', data);
        setError(data.message);
      }
    } catch (error) {
      console.error('signin error:', error);
    }
  }

  const isFormInvalid = !creds.username || !creds.email || !creds.password || !isEmailValid || !isPasswordValid;

  return (

    <>
      <ToastContainer />
    
      <div className="min-h-screen h-screen w-full flex items-center justify-center bg-neutral-900 bg-opacity-90 bg-blend-overlay p-4 bg-cover bg-center" style={{ backgroundImage: "url('/hero3.jpg')" }}>

        <Link className='absolute top-4 left-4 hidden md:block' to='/'><img className='h-14 w-14 cursor-pointer' src="/logo.gif" alt="" /></Link>

        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-12 h-[90%]">
          <h2 className="text-5xl font-bold mb-8 text-black">Let's get started.</h2>

          <div className="flex flex-col gap-6">

            <div>
              <label htmlFor="username" className="block text-base font-medium text-gray-900 mb-2">Your name</label>
              <input
                type="text"
                name="username"
                value={creds.username}
                onChange={handleChange}
                placeholder="Jamie Larson"
                className="w-full bg-gray-100 text-black text-lg px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-900 mb-2">Email address</label>
              <input
                type="text"
                name="email"
                value={creds.email}
                onChange={handleChange}
                placeholder="jamie@example.com"
                className={`w-full bg-gray-100 text-black text-lg px-4 py-3 rounded-md border focus:outline-none focus:ring-2
                ${isEmailValid ? 'border-gray-300 focus:ring-green-300' : 'border-red-500 focus:ring-red-500'}`}
              />

              {!isEmailValid && (
                <p className="text-sm text-red-500 mt-1">Please enter a valid email address.</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-900 mb-2">Password</label>
              <input
                type="text"
                name="password"
                value={creds.password}
                onChange={handleChange}
                placeholder="At least 10 characters"
                className={`w-full bg-gray-100 text-black text-lg px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 ${isPasswordValid ? 'border-gray-300 focus:ring-green-300' : 'border-red-500 focus:ring-red-500'}`}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              {!isPasswordValid && <p className='text-sm text-red-500 mt-1'>password must consist of 8 digits with one capital letter, one number & one special character</p>}
            </div>

            <button
              onClick={handleLogin}
              type="button"
              disabled={isFormInvalid}
              className={`bg-neutral-700 bg-opacity-90 hover:bg-neutral-900 text-white text-lg w-full py-3 rounded-md font-semibold transition duration-200
                ${isFormInvalid ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              Continue →
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-5">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and have read and understood the{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

    </>
  )
}

export default Signup
