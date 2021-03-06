/**
 * Created by lzy on 2017/9/2.
 *
 *  <p>
 *      文章类型
 */
var mongoose = require('mongoose');
require('../models/articles_type');
var ArticlesTypeModel = mongoose.model('ArticlesTypeModel');
var ArticlesModel = mongoose.model('ArticlesModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('article');


//添加文章类型
exports.addArticleType = function (req, res) {
    var articleType = req.body.articleType;
    if (!articleType){
        log.error('addArticleType params error: articleType is null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesTypeModel.findOne({ name: { $regex: articleType.name,$options:"i"}}).exec(function (err, type) {
        if (err){
            log.error('addArticleType error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (type){
            res.json(result.json(response.C608.status, response.C608.code, response.C608.msg, null));
            return;
        }
        var newArticleType = new ArticlesTypeModel(articleType);
        newArticleType.save(function (err) {
            if (err){
                log.error('addArticleType error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            ArticlesTypeModel.find({$or: [{account_id: articleType.account_id},{account_id: 'sys'}]}).exec(function (err, types) {
                if (err){
                    log.error('addArticleType error, errMsg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, types));
            });
        })
    });
};

//删除 可通过account_id 或 ObjectId
exports.delArticleType = function (req, res) {
    var id = req.query.id;
    if (!id){
        log.error('delArticleType params error: articleType is null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesTypeModel.findOne({_id: id},function (err, doc) {
        if (err){
            log.error('delArticleType error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticlesModel.remove({account_id: doc.account_id, type: doc._id}).exec(function (err) {
            if (err){
                log.error('delArticleType to del article error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            doc.remove(function (err) {
                if (err){
                    log.error('delArticleType error, errMsg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                ArticlesTypeModel.find({$or: [{account_id: doc.account_id},{account_id: 'sys'}]}).exec(function (err, types) {
                    if (err){
                        log.error('delArticleType error, errMsg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, types));
                });
            });
        });
    });
};

//查找所有的文章类型
exports.findByDefault = function (req,res) {
    ArticlesTypeModel.find({account_id: null}, function (err, docs) {
        if (err){
            console.log('findByDefault err , msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        res.json({code: true, msg: '查询成功!!', data: docs});
    });
};

//查找某个用户的所有文章类型
exports.findByAccount = function (req, res) {
    ArticlesTypeModel.find({account_id: null, name: req.body.account_id})
        .exec(function (err, docs) {
            if (err){
                console.log('findByAccount  err , msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '查询成功!!', data: docs});
        });
};

exports.deleteByAccount = function (account_id) {
    ArticlesTypeModel.remove({account_id: account_id})
        .exec(function (err) {
            if (!err){
                return true;
            }else {
                throw new Error(err);
            }
        });
};
