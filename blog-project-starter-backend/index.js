// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
require("dotenv").config();

const app = express();
app.use(cors())

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });


// Define Schema
const blogSchema = new mongoose.Schema({
  newTitle: String,
  newContent: String,
  date:String,
  likes:Number
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    console.log(blogs)
    res.send(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/blogs/:id',async(req,res)=>
{
  try{
    const id= req.params.id
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set:{
           newTitle: req.body.newTitle,
          newContent: req.body.newContent,
        },
      },
      {new:true}
    )

    if(!updatedBlog)
    {
      return res.status(404).json({message:"Blog not found"})
    }
    res.json(updatedBlog)
   }catch(error)
  {
    res.status(500).json({message:error.message})
  }
})


app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).send("Blog not found");
        }

        console.log("Blog deleted successfully");
        res.status(200).send("Blog deleted successfully");

    } catch (err) {
        console.log("Error deleting blog", err);
        res.status(500).send("Error deleting blog");
    }
});



app.patch('/api/blogs/like/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // Increment the likes of the blog post
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true } // This option returns the modified document rather than the original
      );
  
      res.json(updatedBlog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


app.post('/api/blogs', async (req, res) => {

  const blog = new Blog({
    newTitle: req.body.newTitle,
    newContent: req.body.newContent,
    date:req.body.date,
    likes:req.body.likes
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
