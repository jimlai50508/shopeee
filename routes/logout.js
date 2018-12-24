var express = require('express');
var router = express.Router();
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)

// 路由設置
router.get('/', function(req, res, next) {
	req.session.destroy()
	res.redirect('/')
})

module.exports = router;