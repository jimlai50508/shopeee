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
// 引入fs
var fs = require('fs')
// 引入fileupload
var fileupload = require('express-fileupload');
router.use(fileupload());
// 引入s3
var s3 = require('../resource/amazon/s3.js')

// 路由設置
router.get('/', function(req, res, next) {
	let context = {
		nowPosition: 'Post'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		res.render('post', context);
	} else {
		res.redirect('/login')
	}
})

router.post('/', function(req, res, next) {
	let context = {
		nowPosition: 'Post'
	}
	if (req.session.login) {
		let formFiles = req.files.image
		if (!Array.isArray(formFiles)) {
			formFiles = [formFiles]
		}
		console.log(formFiles)
		let formImages = formFiles.map(async(image)=> {
			let token = `${crypto.randomBytes(10).toString('hex')}.jpg`	
			s3.bucketPromise.then(s3.uploadImage.bind(this))
			await s3.uploadImage(token, image.data)
			return token
		})
		Promise.all(formImages).then(function(results) {
			let images = results.map(image=> {
				return image
			})
			storeData(images)
		})
		let storeData = function(images) {
			let productToken = crypto.randomBytes(10).toString('hex')
			let editToken = crypto.randomBytes(10).toString('hex')
			let deleteToken = crypto.randomBytes(10).toString('hex')
			context['login'] = true
			context['username'] = req.session.username
			productSchema.create({
				seller: req.session.username,
				product: req.body.product,
				images: images,
				price: req.body.price,
				stock: req.body.stock,
				category: req.body.category,
				subcategory: req.body.subcategory,
				productToken: productToken,
				editToken: editToken,
				deleteToken: deleteToken,
				description: req.body.description,
				postTime: new Date().getTime()
			}, function(err) {
				if (err) {
					context['message'] = '新增商品失敗，請再試一次。'
				} else {
					context['message'] = '新增商品成功。'
					res.render('message', context)
				}
			})
		}
	} else {
		res.send('請先登入')
	}
})

module.exports = router;