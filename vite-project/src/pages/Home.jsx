import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useAuth } from '../context/authContex'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// import {getBloggerPosts} from '../api/BlogApi'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';

const images = [
    '/hero4.jpg',
    '/hero.jpg',
    '/hero2.jpg'
];

const Home = () => {

    const [blogs, setBlogs] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const port = import.meta.env.VITE_SERVER_URL;

    const { isAuthenticated } = useAuth();

    useEffect(() => {

        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${port}/blog`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: 'Access-Control-Allow-Origin',
                })

                const data = await res.json();
                // console.log("posted blog", data);

                if (res.ok) {
                    // console.log('blog fetched successfully');
                    setBlogs(data);
                }
                // else {
                //     console.log('error fetching blog');
                // }
            } catch (error) {
                console.error('error while fetching blog', error);
            }
        }
        fetchBlogs();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);


    return (
        <main className='scroll'>
            {/* first section */}
            <section className='first flex flex-col justify-center items-center h-screen relative overflow-hidden'>

                {/* image slider */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    {images.map((img, i) => (
                        <img key={i} src={img} alt={`slide-${i}`} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentImageIndex === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} />
                    ))}
                </div>

                <div className="headers flex flex-col gap-2 md:justify-center items-center h-[50%] mt-10 z-20 relative">

                    <div className='flex flex-col md:items-center'>
                        <p className='text-6xl md:text-3xl ml-2 md:ml-0 text-white font-bold md:font-normal'>EVERYTHING IS PERSONAL </p>
                        <p className='text-3xl md:text-2xl ml-2 md:ml-0 text-white font-semibold md:font-normal'>SO IS YOUR BLOG</p>
                        <h1 className='md:text-8xl font-bold ml-2 md:ml-0 text-white hidden md:block space-y-0'>CREATE YOUR FIRST BLOG</h1>

                        {isAuthenticated && <Link to='/blog/create'><button type="button" className="text-white md:w-full w-[90%] mt-4 ml-5 md:ml-0 md:mt-0 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 cursor-pointer h-14 text-lg">Get Started</button></Link>}

                        {!isAuthenticated && <Link to='/user/login'><button type="button" className="text-white md:w-full w-[90%] mt-4 ml-5 md:ml-0 md:mt-0 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 cursor-pointer h-14 text-lg">Get Started</button></Link>}

                    </div>

                </div>


            </section>

            <section className="second h-screen bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 bg-orange-200 flex flex-col justify-center items-center md:h-[90%] h-full rounded-lg">
                    <h2 className="text-5xl font-bold mb-6 text-center text-white">Featured Blogs</h2>

                    <div className="w-full flex justify-center p-2 h-[70%] md:h-[80%]">

                        <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'}
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            pagination={true}
                            modules={[EffectCoverflow, Pagination]}
                            className="mySwiper">

                            {blogs.map((blog, idx) => (
                                <SwiperSlide key={idx} className="max-w-sm">
                                    <Card key={idx} blog={blog} />
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </div>
                </div>
            </section>

            <section className="third bg-gray-900 text-white py-10">
                <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">

                    <ul className="flex flex-col sm:flex-row justify-between items-center gap-6 text-lg font-medium mb-6">
                        <li className="hover:text-purple-400 transition-colors cursor-pointer">About Us</li>
                        {isAuthenticated && <Link to={'/user/dashboard'}><li className="hover:text-purple-400 transition-colors cursor-pointer">Dashboard</li></Link>}
                        {isAuthenticated && <NavLink to={'/blog/yourblogs'}><li className="hover:text-purple-400 transition-colors cursor-pointer">Your Blogs</li></NavLink>}
                        <li className="hover:text-purple-400 transition-colors cursor-pointer">Contact Us</li>
                    </ul>

                    <p className="text-sm text-gray-400 text-center">
                        © {new Date().getFullYear()} BlogApp Inc. All rights reserved.
                    </p>

                </div>
            </section>
        </main>
    )
}

export default Home
