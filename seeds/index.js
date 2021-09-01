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
    for(var i=0 ; i<20 ; i++){
        const post = new Post({
            title: `Post ${i+1}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/qksicphhr/image/upload/v1629719399/9Gig/ayz1oshyjawad7rqrudb.webp', // up to your data
                    filename: '9Gig/9Gig_Seeds_Img'
                }
            ],
            upvoteNum:0,
            downvoteNum:0,
            author: '612cbdd7df5ea4412c173e11', // up to your data
            tags: [ // up to your data
                {
                    _id: '612ca57b346cf43a10c2598c',
                    body: 'Ask 9GAG',
                    url: 'ask-9gag'
                }
            ]
        })
        await post.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})