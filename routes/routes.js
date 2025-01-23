const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const {login} = require('../middleware/login_middleware');
const {admin} = require('../middleware/admin_middleware');
const upload = require('../middleware/image_middleware');

router.post('/login', controller.login_user);
router.post('/register', controller.register_user);
router.get('/home', login, controller.home_login);
router.get('/admin/home',login,admin, controller.home_login);
router.post('/upload',login,admin,controller.upload_image);
router.post('/passwordchange', login,controller.changePassword);
router.delete('/deleteimage/:id', login, controller.deleteImage);
router.get('/allImages', login,admin, controller.fetchallImage);

module.exports = router;