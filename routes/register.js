var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)
// 引入crypto
var crypto = require("crypto");
// 引入nodemailer
var mailer = require('../resource/nodemailer/main.js');

// 路由設置
router.get('/', function(req, res, next) {
	let context = {
		nowPosition: 'Register'
	}
	if (req.session.login) {
		res.redirect('/member')
	} else {
		res.render('register', context)
	}
});

router.post('/', function(req, res, next) {
	let context = {
		nowPosition: 'Register'
	}
	let activeToken = crypto.randomBytes(10).toString('hex')
	memberSchema.update({
		username: req.body.username,
		active: false
	}, {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		active: false,
		activeToken: activeToken,
		registerTime: new Date().getTime(),
		registerDate: new Date().getTime()
	},	{upsert: true}, function(err, tank) {
		if (err) {
			context['message'] = '註冊失敗，請再試一次。'
		} else {
			let link = `https://shopeee.herokuapp.com/register/${activeToken}`
			mailer({
		        to: req.body.email,
		        subject: '歡迎註冊Shopeee',
		        html: `您好，請點擊<a href="${link}">此處</a>啟用帳號`
		    });
			context['message'] = '註冊成功，請在30分鐘內收取驗證信'
		}
		res.render('message', context)
	});
});

router.get('/:activeToken', function(req, res, next) {
	let context = {
		nowPosition: 'Register / Active Account'
	}
	memberSchema.update({
		activeToken: req.params.activeToken,
		registerTime: {$gt: new Date().getTime() - 30 * 60 * 1000}
	}, {
		active: true
	}, function(err, tank) {
		if (tank['n'] == 0) {
			context['message'] = "帳號驗證失敗"
			res.render('message', context)
		} else {
			context['message'] = "帳號驗證成功"
			res.render('message', context)
		}		
	})
})

module.exports = router;

