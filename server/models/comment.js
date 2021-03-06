/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     评论、回复 Schema
 */
var mongoose = require('mongoose');
require('../models/comment');
var Schema = mongoose.Schema;
var accountSchema = require('./account').accountSchema;

var replySchema = new Schema({
    from: {type: accountSchema, required: true},
    subject: {type: accountSchema, required: false},
    content: {type: String, required: true},
    parent_id: {type:String, required: false},
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    strict: true
});

replySchema.add({replies: [replySchema]});

var commentSchema = new Schema({
    replies:[replySchema]
},{
    id: true,
    _id: true,
    safe: true,
    strict: true,
    collection: 'comment'
});

commentSchema.set('versionKey', '_comment');

mongoose.model('CommentModel', commentSchema);
mongoose.model('ReplyModel', replySchema);
exports.commentSchema = commentSchema;