var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
var orderSchema = require('../schema/order.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)

// 路由設置
router.get('/', function(req, res, next) {
	let context = {
		nowPosition: 'Member'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		memberSchema.findOne({username: req.session.username})
			.then(docs=> {
				let favorite = res.favorite
				let favoritePromise = productSchema.find({productToken: { $in: favorite }})
					.then((docs)=> {
						context['favorites'] = docs.map(product=> {
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
					})
				let productPromise = productSchema.find({seller: req.session.username})
					.then(docs=> {
						context['products'] = docs.map(product=> {
							return {
								product: product.product,
								images: product.images,
								price: product.price,
								stock: product.stock,
								productToken: product.productToken,
								editToken: product.editToken,
								deleteToken: product.deleteToken,
								description: product.description
							}
						})
						context['products'].reverse()
					})
				let orderPromise = orderSchema.find({buyer: req.session.username})
					.then(docs=> {
						context['orders'] = docs.map(order=> {
							return {
								time: order.time,
								buyer: order.buyer,
								total: order.total,
								datas: order.datas
							}
						})
						context['orders'].reverse()
					})
				Promise.all([favoritePromise, productPromise,orderPromise])
					.then(docs=> {
						console.log(context)
						res.render('member', context);
					})
			})
	} else {
		res.redirect('/')
	}
});

module.exports = router;
