// export const getBlogsData = async() => {

//     try {
//         const res = await fetch('https://dog.ceo/api/breeds/image/random');
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.error('error while fetching blog api : ', error);
//     }
// }


// chatgpt api:
// import blogData from '../data/blogData.json';


// export const getBlogsData = async () => {

//     try {
//         const res = await fetch('https://dog.ceo/api/breeds/image/random/5'); // fetch 5 random images
//         const data = await res.json();
//         console.log(data);
//         const images = data.message;

//         return images.map((imgurl, idx) => ({
//             title: blogData[idx].title,
//             content: blogData[idx].content,
//             image: imgurl,
//         }));
//     } catch (error) {
//         console.error('Error while fetching blog data:', error);
//         return [];
//     }
// };

// unslpash api:
// export const getUnsplashPhotos = async () => {

//     const accessKey = 'ptfp37j5vn1QF8XmN6r9hJMKu3l1NYH1CR75T8wIduw';
//     const url = `https://api.unsplash.com/photos/random?count=5&client_id=${accessKey}`;

//     try {
//         const res = await fetch(url);
//         const data = await res.json();
//         console.log(data);

//         return data.map((photo) => ({
//             title: photo.alt_description || "Untitled",
//             content: photo.slug || "A beautiful photo from Unsplash.",
//             image: photo.urls.regular,
//         }));
//     } catch (error) {
//         console.error('Error fetching Unsplash photos:', error);
//         return [];
//     }
// };

// blogger api by google:
// const API_KEY = 'AIzaSyC8_pIXQCEy-KPxQu96McEWPCI0Y_AJPkg';
// const BLOG_ID = '3428734473792069908';

// export const getBloggerPosts = async () => {

//   try {
//     const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`);
//     const data = await res.json();

//     return data.items.map(post => ({
//       title: post.title,
//       content: post.content,
//       published: post.published,
//       url: post.url,
//       image: extractFirstImage(post.content),
//     }));
//   } catch (error) {
//     console.error('Error fetching Blogger posts:', error);
//     return [];
//   }
// };

// const extractFirstImage = (html) => {
//   const match = html.match(/<img[^>]+src="([^">]+)"/);
//   return match ? match[1] : null;
// };



