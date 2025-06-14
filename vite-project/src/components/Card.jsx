import React from 'react'
import { NavLink } from 'react-router-dom';
import Nav from './Nav';

const Card = ({ blog }) => {

  const port = import.meta.env.VITE_SERVER_URL;
  
  return (
    <div className='Card cursor-pointer group relative bg-gray-300 h-full w-full flex flex-col gap-3 justify-start overflow-hidden rounded-md p-2 transition-transform duration-300 hover:scale-105'>

      <img className='rounded-sm h-[50%] bg-cover' src={`${port}/${blog.coverImgUrl}`} alt={blog.title} />
      <h1 className="font-bold text-2xl">{blog.title}</h1>
      <p className="line-clamp-2 text-sm text-gray-700">
        {blog.body}
      </p>


      {/* Popup Box */}
      <NavLink to={`/blog/${blog._id}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h1 className="text-lg font-bold">Wanna know more?</h1>

          <p className="text-sm text-center px-3">Click on it to continue reading</p>

        </div>
      </NavLink>
    </div>
  )
}

export default Card