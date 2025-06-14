import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/authContex'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const port = import.meta.env.VITE_SERVER_URL;

  const notify = () => toast.success("Login successful!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });


  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }

    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!creds.email || !creds.password) {
      alert('inputs cant be empty');
    }

    try {
      const response = await fetch(`${port}/user/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
        credentials: 'include',
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        await checkAuth();
        console.log('login successfull', data);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCreds({ email: "", password: "" });
        navigate('/');
        setError('');
      }
      else {
        // console.log('login failed', data);
        setError(data.realError);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const isFormInvalid = !creds.email || !creds.password || !isEmailValid;

  return (

    <main>

      <ToastContainer />

      <section className="grid grid-cols-1 md:grid-cols-2 items-center h-screen px-4 md:px-10 bg-gray-200">

        <Link className='absolute top-4 left-4 hidden md:block' to='/'><img className='h-10 w-10 cursor-pointer' src="/arrow.png" alt="" /></Link>

        {/* Welcome Section */}
        <div className="hidden md:flex h-[60%] flex-col justify-center items-center bg-gradient-to-br bg-neutral-900 bg-opacity-90 rounded-xl shadow-xl text-white p-10 transition-all duration-300">
          <h1 className="flex gap-2 items-center text-4xl font-bold mb-4"><Link to={'/'}><span className='cursor-pointer'><img className='h-14' src="/logo.gif" alt="" /></span></Link>Welcome!</h1>
          <p className="text-base text-center max-w-md leading-relaxed">
            Share your thoughts, grow your audience, and manage your blogs with ease.
            Your writing journey starts here — let’s get you logged in.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center h-[60%] bg-white rounded-xl shadow-2xl p-8 md:mr-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Let's get started.</h2>

            <div className="flex flex-col gap-5">

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={creds.email}
                  onChange={handleChange}
                  placeholder="jamie@example.com"
                  className={`w-full bg-gray-100 text-black px-4 py-3 rounded-md border ${isEmailValid ? 'border-gray-300 focus:ring-indigo-400' : 'border-red-500 focus:ring-red-500'} focus:outline-none focus:ring-2`}
                />

                {!isEmailValid && (
                  <p className="text-sm text-red-500 mt-1">Please enter a valid email address.</p>
                )}

              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="text"
                  name="password"
                  value={creds.password}
                  onChange={handleChange}
                  placeholder="At least 10 characters"
                  className="w-full bg-gray-100 text-black px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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

            <p className="text-sm text-center text-gray-500 mt-6">
              Don’t have an account?{' '}
              <a href="/user/signup" className="text-indigo-600 font-medium underline hover:text-indigo-800">
                Signup
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
