var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)

// 路由設置
router.get('/', function(req, res, next) {
	let context = {
		nowPosition: 'Index'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
	}
	res.render('index', context);
});

module.exports = router;
