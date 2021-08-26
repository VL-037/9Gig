if(process.env.NODE_ENV !== 'production')
    require("dotenv").config()

const mongoose = require('mongoose');
const tags = require('./tags');
const Comment = require('../models/comment')
const Post = require('../models/post')
const Tag = require('../models/tag')

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/9gig', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Comment.deleteMany({})
    await Post.deleteMany({})
    // await Tag.deleteMany({})
    // for(var i=0 ; i<tags.tags.length ; i++){
    //     const newTag = new Tag({
    //         body: tags.tags[i],
    //         url: tags.tags[i].toLowerCase().replace(/\s/g, "-")
    //     })
    //     await newTag.save()
    // }
    for(var i=0 ; i<2 ; i++){
        const post = new Post({
            title: `Post ${i}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/qksicphhr/image/upload/v1629719399/9Gig/ayz1oshyjawad7rqrudb.webp',
                    filename: '9Gig/9Gig_Seeds_Img'
                }
            ],
            upvoteNum:0,
            downvoteNum:0,
            author: '6123896b6d7bcf2798cdd6b5',
            tags: [
                '612763292f3f054244e0ed7e',
            ]
        })
        await post.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})