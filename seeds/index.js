const mongoose = require('mongoose')
const Post = require('../models/post')

mongoose.connect('mongodb://localhost:27017/9gig', {
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
    await Post.deleteMany({})
    for(let i=0 ; i<50 ; i++){
        const randUp = Math.floor(Math.random() * 1000) + 100
        const randDown = Math.floor(Math.random() * 60) + 10
        const post = new Post({
            title: `Post ${i}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam rerum minus sint doloremque velit quod nihil vel aut unde tenetur nobis, voluptates eaque expedita necessitatibus enim ducimus iure blanditiis placeat? Inventore nam ea fugiat at in reprehenderit cupiditate error id quas voluptates, quis eos placeat. Dolorem ipsa sapiente molestiae aliquam voluptates quas incidunt obcaecati, in, nam culpa, illum placeat iusto!',
            upvote: randUp,
            downvote: randDown,
            author: '60e29f28e5753e07e84f5da8'
        })
        await post.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})