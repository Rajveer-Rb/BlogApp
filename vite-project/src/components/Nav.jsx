import React from 'react'
import { useState, useEffect, useRef,useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContex';

const Nav = () => {

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAuthenticated, getUserId } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({name: '', profileimage: ''});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const sidebarRef = useRef(null); // Create a ref for the sidebar
  const port = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

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
        setUser({name: data.username, profileimage: data.profilepic});
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

  return (
    <nav className='w-full bg-white text-black p-2 relative z-30'>

      <ul className='flex items-center gap-3 w-fit p-2'>
        <Link to="/"> <li className='flex items-center'><img src="/logo.gif" alt="logo" className='h-9' /><span className='text-xl font-bold'>BlogApp</span></li></Link>

        {isAuthenticated && <> 

          <li className='hidden md:block'>

            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="text-white bg-black hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center cursor-pointer"
            >
              Menu
              <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
              </svg>
            </button>
          </li>
          {dropdownOpen && (
            <div className="absolute top-14 left-40 mt-2 z-10 bg-transparent divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li><Link to="/user/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link></li>
                <li><Link to="/blog/create" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Create</Link></li>
                <li><Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Profile</Link></li>
                <li><Link to="/blog/yourblogs" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Blogs</Link></li>
                <li><Link to="/user/logout" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link></li>
              </ul>
            </div>
          )}

          <li className='absolute right-3'>
            <img className='cursor-pointer w-12 h-12 rounded-full object-cover border-4 border-blue-500' src={user.profileimage ? `${port}/${user.profileimage}` : '/profilemenu.png'} alt="" onClick={() => setSidebarOpen(true)} />
          </li>

        </>}


        {!isAuthenticated && <>
          <li><Link to="/user/login">login</Link></li>
          <li><Link to="/user/signup">signup</Link></li>
        </>
        }
      </ul>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed top-0 right-0 w-64 h-[90%] md:h-[100%] rounded-b-md bg-gray-800 text-white z-50 p-6 shadow-lg transition-transform duration-300 ease-in-out" ref={sidebarRef}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{user.name ? user.name : 'Menu'}</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl hover:text-gray-400">&times;</button>
            </div>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/user/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/user/profile" onClick={() => setSidebarOpen(false)} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                  Your Profile
                </Link>
              </li>
              <li>
                <Link to="/blog/yourblogs" onClick={() => setSidebarOpen(false)} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                  Your Blogs
                </Link>
              </li>
              <li>
                <Link to="/user/logout" onClick={() => setSidebarOpen(false)} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  )
}

export default Nav


// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/authContex';

// const Nav = () => {

//   const { isAuthenticated } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const location = useLocation();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     setDropdownOpen(false);
//     setSidebarOpen(false); // close sidebar on route change
//   }, [location.pathname]);

//   return (
//     <nav className='h-full w-full bg-neutral-900 text-white p-2 relative'>

//       <ul className='flex items-center justify-between px-4'>
//         <Link to="/">
//           <li className='flex items-center gap-2'>
//             <img src="logo.gif" alt="" className='h-9' />
//             <span className='text-xl font-bold'>BlogApp</span>
//           </li>
//         </Link>

//         <div className='flex items-center gap-4'>

//           {isAuthenticated && <>
//             <li className='hidden md:block'>

//               <button onClick={() => setDropdownOpen(prev => !prev)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
//                 <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div ref={dropdownRef} className="absolute top-14 left-40 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
//                   <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//                     <li><Link to="/user/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link></li>
//                     <li><Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Profile</Link></li>
//                     <li><Link to="/blog/yourblogs" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Blogs</Link></li>
//                     <li><Link to="/user/logout" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link></li>
//                   </ul>
//                 </div>
//               )}
//             </li>

//             <li className='menu cursor-pointer' onClick={() => setSidebarOpen(true)}>
//               <img src="/profilemenu3.png" alt="menu" />
//             </li>
//           </>}

//           {!isAuthenticated && (
//             <>
//               <li><Link to="/user/login">login</Link></li>
//               <li><Link to="/user/signup">signup</Link></li>
//             </>
//           )}
//         </div>
//       </ul>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-64 bg-neutral-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
//       >
//         <div className="flex justify-between items-center p-4 border-b border-neutral-600">
//           <h2 className="text-lg font-bold">Menu</h2>
//           <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl">&times;</button>
//         </div>
//         <ul className="flex flex-col p-4 gap-3 text-base">
//           <li><Link to="/user/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</Link></li>
//           <li><Link to="/user/profile" onClick={() => setSidebarOpen(false)}>Your Profile</Link></li>
//           <li><Link to="/blog/yourblogs" onClick={() => setSidebarOpen(false)}>Your Blogs</Link></li>
//           <li><Link to="/user/logout" onClick={() => setSidebarOpen(false)}>Sign out</Link></li>
//         </ul>
//       </div>

//       {/* Optional backdrop when sidebar is open */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </nav>
//   );
// };

// export default Nav;
