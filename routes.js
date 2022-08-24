let Router = require("express").Router();
let multer = require("multer")
let path   = require("path");

let storage = multer.diskStorage({
    filename: function (request, file, callback){
        let fileDatas = {
            name: file.originalname,
            type: file.mimetype
        }
        let filename = Date.now() +"-"+ Math.round(Math.random() * 1E9) +"."+ fileDatas.name.split(".").pop();
        callback(null, filename);
    },
    destination: function (request, file, callback){
        callback(null, path.join(__dirname, process.env.PATH_UPLOADS_MEDIA));
    }
})
let upload = multer( {storage: storage} );



let controllers = {
    main:       require("./controllers/MainController"),
    user:       require("./controllers/UserController"),
    post:       require("./controllers/PostController"),
    taxonomy:   require("./controllers/TaxonomyController"),
    comment:    require("./controllers/CommentController"),
    media:      require("./controllers/MediaController"),
    gallery:    require("./controllers/GalleryController"),
    contact:    require("./controllers/ContactController"),
    menu:       require("./controllers/MenuController")
}

Router.get(     "/",                controllers.main.Index);
Router.post(    "/login",           controllers.main.Login);
Router.get(     "/logout",          controllers.main.Logout);

Router.get(     "/users",        controllers.user.GetAll);
Router.post(    "/users",        controllers.user.Create);
Router.get(     "/users/:id",    controllers.user.GetOne);
Router.put(     "/users/:id",    controllers.user.Update);
Router.delete(  "/users/:id",    controllers.user.Delete);

Router.get(     "/posts",        controllers.post.GetAll);
Router.post(    "/posts",        controllers.post.Create);
Router.get(     "/posts/:id",    controllers.post.GetOne);
Router.put(     "/posts/:id",    controllers.post.Update);
Router.delete(  "/posts/:id",    controllers.post.Delete);

Router.get(     "/taxonomies",              controllers.taxonomy.GetAll);
Router.get(     "/taxonomies/:id",          controllers.taxonomy.GetOne);
Router.get(     "/taxonomies/:id/terms",    controllers.taxonomy.GetOneWithTerms);
Router.post(    "/taxonomies",              controllers.taxonomy.Create);
Router.put(     "/taxonomies/:id",          controllers.taxonomy.Update);
Router.delete(  "/taxonomies/:id",          controllers.taxonomy.Delete);
Router.get(     "/taxonomies/terms",        controllers.taxonomy.Terms);
Router.post(    "/taxonomies/terms",        controllers.taxonomy.AddTerm);
Router.put(     "/taxonomies/terms/:id",    controllers.taxonomy.UpdateTerm);
Router.delete(  "/taxonomies/terms/:id",    controllers.taxonomy.DeleteTerm)

Router.get(     "/contacts",        controllers.contact.GetAll);
Router.post(    "/contacts",        controllers.contact.Create);
Router.get(     "/contacts/:id",    controllers.contact.GetOne);
Router.put(     "/contacts/:id",    controllers.contact.Update);
Router.delete(  "/contacts/:id",    controllers.contact.Delete);

Router.get(     "/comments",        controllers.comment.GetAll);
Router.post(    "/comments",        controllers.comment.Create);
Router.get(     "/comments/:id",    controllers.comment.GetOne);
Router.put(     "/comments/:id",    controllers.comment.Update);
Router.delete(  "/comments/:id",    controllers.comment.Delete);

Router.get(     "/galleries",        controllers.gallery.GetAll);
Router.post(    "/galleries",        controllers.gallery.Create);
Router.get(     "/galleries/:id",    controllers.gallery.GetOne);
Router.put(     "/galleries/:id",    controllers.gallery.Update);
Router.patch(   "/galleries/:id",    controllers.gallery.UploadImage);
Router.delete(  "/galleries/:id",    controllers.gallery.Delete);

let mwMediaUpload = upload.single("media_file");
Router.get(     "/medias",        controllers.media.GetAll);
Router.post(    "/medias",        mwMediaUpload, controllers.media.Create);
Router.get(     "/medias/:id",    controllers.media.GetOne);
Router.put(     "/medias/:id",    upload.none(), controllers.media.Update);
Router.delete(  "/medias/:id",    controllers.media.Delete);


Router.get(     "/menus",              controllers.menu.GetAll);
Router.get(     "/menus/:id",          controllers.menu.GetOne);
Router.get(     "/menus/:id/terms",    controllers.menu.GetOneWithItems);
Router.post(    "/menus",              controllers.menu.Create);
Router.put(     "/menus/:id",          controllers.menu.Update);
Router.delete(  "/menus/:id",          controllers.menu.Delete);
Router.delete(  "/menus/:id/clean",    controllers.menu.Clean);
Router.post(    "/menus/items",        controllers.menu.AddItem);
Router.put(     "/menus/items/:id",    controllers.menu.UpdateItem);
Router.delete(  "/menus/items/:id",    controllers.menu.DeleteItem)

module.exports = Router;
