import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    clientName: String,
    city: String,
    balance: String,
    haveMortgage: String,
    numCreditCards: Number,
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;