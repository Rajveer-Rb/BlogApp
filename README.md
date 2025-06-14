Title: BlogApp

Description: Share your thoughts, grow your audience, and manage your blogs with ease.

Installation steps:

// frontend:

1. npm install (to include npm libraries and node modules)

2. tailwind css

    npm install tailwindcss @tailwindcss/vite (to use tailwind css properties)
    
    // then include this in your 'vite.config.ts' file
    import { defineConfig } from 'vite'
    import tailwindcss from '@tailwindcss/vite'
    export default defineConfig({
        plugins: [
        tailwindcss(),
      ],
    })

    // add an `@import` to your CSS file that imports Tailwind CSS.
    @import "tailwindcss";

3. run your frontend using 'npm run dev' in your terminal

// backend:

1. npm install

2. npm i express (to access servers)

3. npm i mongoose (to access database)