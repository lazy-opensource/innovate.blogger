/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    心情/日记 路由层
 * </p>
 *
 */
var notesService = require('../service/notes');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.get(webRootApi +'/private/my/notes', notesService.notes);
    router.post(webRootApi +'/private/my/note', notesService.addNote);
    router.delete(webRootApi +'/private/my/note', notesService.delNote);
    router.post(webRootApi +'/private/my/note/praise', notesService.praise);
    router.post(webRootApi +'/private/my/note/comment', notesService.comment);
    router.delete(webRootApi +'/private/my/note/comment', notesService.delComment);
};
