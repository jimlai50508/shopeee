var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)

// 路由設置
router.get('/:keyword', function(req, res, next) {
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		res.redirect(`/search/${req.params.keyword}/1`)
	} else {
		res.redirect('/login')
	}
})
router.get('/:keyword/:page', function(req, res, next) {
	let context = {
		nowPosition: `Search ${req.params.keyword}`
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		memberSchema.findOne({username: req.session.username}, function(err, data) {
			let favorite = data.favorite
			let perPage = 20
			let skipItem = (req.params.page - 1) * perPage
			context['currentPage'] = req.params.page
			context['perPage'] = perPage
			productSchema.find({
				seller: {$ne: req.session.username},
				product: new RegExp( req.params.keyword, "i"),
				stock: { $gt : 0}
			}, null, {sort: {postTime: -1}})
			.skip(skipItem).limit(perPage)
			.exec(function(err, data) {
				context['products'] = data.map(product=> {
					return {
						product: product.product,
						seller: product.seller,
					    images: product.images,
					    price: product.price,
					    stock: product.stock,
					    productToken: product.productToken,
					    description: product.description,
					    favorite: favorite.includes(product.productToken)
					}
				})
				res.render('products', context)
			})
		})
	} else {
		let perPage = 20
		let skipItem = (req.params.page - 1) * perPage
		context['currentPage'] = req.params.page
		context['perPage'] = perPage
		productSchema.find({
			product: new RegExp( req.params.keyword, "i"),
			stock: { $gt : 0}
		}, null, {sort: {postTime: -1}})
		.skip(skipItem).limit(perPage)
		.exec(function(err, data) {
			context['products'] = data.map(product=> {
				return {
					product: product.product,
					seller: product.seller,
				    images: product.images,
				    price: product.price,
				    stock: product.stock,
				    productToken: product.productToken,
				    description: product.description,
				}
			})
			res.render('products', context)
		})
	}
});

module.exports = router;