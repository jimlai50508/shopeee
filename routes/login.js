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
		nowPosition: 'Login'
	}
	if (req.session.login) {
		res.redirect('/member')
	} else {
		res.render('login', context);
	}
})

router.post('/', function(req, res, next) {
	let context = {
		nowPosition: 'Login'
	}
	memberSchema.find({
		username: req.body.username,
		active: true
	}, function(err, data) {
		if (err || data.length==0) {
			context['message'] = '登入失敗，請確認您輸入的帳號密碼正確。'
			res.render('message', context)
		}
		else if (data.length!=0 && req.body.password==data[0].password) {
			req.session.login = true
			req.session.username = data[0].username
			res.redirect('/');
		}
	})
})

module.exports = router;
