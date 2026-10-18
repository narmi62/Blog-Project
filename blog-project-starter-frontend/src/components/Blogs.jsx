import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from "axios"
import Footer from './common/Footer';
import auth from '../config/firebase'
function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);

        auth.onAuthStateChanged(function (user) {
            console.log("Current user:", user);
            if (user) {

                if (user.uid === "v0BRSMrL3nXhA13wx2yL5IcHZyB2") {
                    setAdmin(true)
                    console.log("Admin logged in")
                }
                else {

                    setAdmin(false)

                    console.log("Not an admin")
                }
            }
        })
        axios.get("https://blog-project-2t4w.onrender.com/api/blogs").then((res) => {
            console.log(res.data)
            setBlogs(res.data)
        }).catch(() => {
            console.log("Error fetching data")
        })
    }, [])



    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editID, setEditID] = useState('')


    const handleLike = async (blog_id) => {
        try {
            const response = await axios.patch(`https://blog-project-2t4w.onrender.com/api/blogs/like/${blog_id}`);
            // After successfully updating the likes count in the backend, fetch the updated list of blogs
            if (response.status === 200) {
                axios.get("https://blog-project-2t4w.onrender.com/api/blogs").then((res) => {
                    console.log(res.data)
                    setBlogs(res.data)
                }).catch(() => {
                    console.log("Error fetching data")
                })
            }
        } catch (error) {
            console.error('Error liking the blog post:', error);
        }
    };

    const handleNewBlogSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page
        const today = new Date();
        const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


        const likes = 0
        axios.post("https://blog-project-2t4w.onrender.com/api/blogs", { newTitle, date, newContent, likes }).then((res) => {
            console.log(res.data)

            axios.get("https://blog-project-2t4w.onrender.com/api/blogs").then((res) => {
                console.log(res.data)
                setBlogs(res.data)
            }).catch(() => {
                console.log("Error fetching data")
            });


        })
            .catch((error) => {
                console.log("Error adding blog", error)
            });

        setNewTitle('');
        setNewContent('');
    };
    //To update blog
    const handleStartEdit = (blog) => {
        setEditID(blog._id)
        setNewTitle(blog.newTitle)
        setNewContent(blog.newContent)
    }

    const handleUpdate = (event) => {
        event.preventDefault()
        axios.put(`https://blog-project-2t4w.onrender.com/api/blogs/${editID}`, { newTitle, newContent }).then((res) => {
            console.log(res.data)
            axios.get("https://blog-project-2t4w.onrender.com/api/blogs")
                .then((res) => {
                    console.log(res.data)
                    setBlogs(res.data)
                    setEditID('')
                    setNewTitle('')
                    setNewContent('')

                }).catch((error) => {
                    console.log("Error fetching data,error")
                })
        }).catch((error) => {
            console.log("Error updating blog", error)
        })

    }

    //deleting the blog
    const handleDelete = (blog_id) => {
        const conFirmDelete = window.confirm(
            "Are you sure you want to delete this blog?"
        )
        if (conFirmDelete) {
            axios.delete(`https://blog-project-2t4w.onrender.com/api/blogs/${blog_id}`)
                .then((res) => {
                    console.log(res.data)
                    axios.get("https://blog-project-2t4w.onrender.com/api/blogs").then((res) => {
                        console.log(res.data)
                        setBlogs(res.data)
                    }).catch((err) => {
                        console.log("Error fetching blogs", err);
                    })
                }).catch((err) => {
                    console.log("Error deleting blog", err);
                })
        }
    }

    return (
        <div className="blog-section py-14">
            <h2 className="text-center text-5xl font-bold mb-14">Latest  <span className='text-orange-400'>Blogs</span> 📚</h2>

            {/* Blog creation form */}

            {
                admin ? <div className="blog-creation-form mb-8" style={{ width: "80%", margin: "auto" }}>
                    <form onSubmit={editID ? handleUpdate : handleNewBlogSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                        <textarea
                            placeholder="Blog Content"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="p-2 border rounded"
                            rows="4"
                            required
                        />
                        <button type="submit" className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600">
                            {editID ? "Update Blog" : "Add Blog"}
                        </button>
                    </form>
                </div> : ""
            }


            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{blog.newTitle}</h3>
                        <p className="blog-date text-gray-400 text-sm mb-4">{blog.date}</p>
                        <p className="blog-content text-gray-600 mb-4">{blog.newContent}</p>
                        <span className="text-blue-500 cursor-pointer" onClick={() => handleLike(blog._id)}>Like</span>
                        <span className="ml-2">{blog.likes} Likes</span>
                        {admin && (
                            <>
                                <button
                                    onClick={() => handleStartEdit(blog)}
                                    className="bg-blue-500 text-white p-2 rounded ml-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="bg-red-500 text-white p-2 rounded ml-3"
                                >
                                    Delete
                                </button>
                            </>)}
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export default Blogs