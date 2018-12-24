var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)

let categories = {
	food: {
		category: '美食、禮品',
		giftbox: '禮盒、伴手禮',
		snack: '餅乾、零嘴',
		instantfood: '熟食、即食',
		beverage: '飲料、沖泡',
		other: '其它'
	},
	male: {
		category: '男裝、服飾',
		top: '上衣、T恤',
		shirt: '上衣、襯衫',
		pants: '長褲、短褲',
		jacket: '外套、大衣',
		accessory: '鞋包、配件',
		other: '其它'
	},
	female: {
		category: '女裝、服飾',
		top: '上衣、T恤',
		shirt: '上衣、襯衫',
		pants: '長褲、短褲',
		jacket: '外套、大衣',
		accessory: '鞋包、配件',
		other: '其它'
	},
	life: {
		category: '生活、家居',
		kitchen: '廚房、餐具',
		furniture: '家具、收納',
		room: '房間、臥室',
		tool: '工具、配件',
		other: '其它'
	},
	entertainment: {
		category: '遊戲、娛樂',
		game: '遊戲、電玩',
		exhibition: '展覽、教育',
		activity: '活動、票券',
		other: '其它'
	},
	'3c': {
		category: '家電、3C',
		nb: '筆記型電腦',
		pc: '桌上型電腦',
		phone: '手機、平板',
		hardware: '周邊、硬體',
		appliance: '家電、電器',
		other: '其它'
	},
	sport: {
		category: '運動、戶外',
		outdoor: '戶外、活動',
		clothes: '服飾、衣著',
		accessory: '配件、訓練',
		sport: '運動',
		other: '其它'
	},
	book: {
		category: '書籍、學習',
		textbook: '教科書',
		magazine: '雜誌',
		literature: '小說、文學',
		science: '科普、自然',
		business: '商業、經濟',
		life: '生活、旅遊',
		disign: '藝術、設計',
		other: '其它'
	},
	other: {
		category: '其它',
		helpbuy: '代購',
		buytogether: '團購',
		customize: '客製化',
		other: '其它'
	}
}

// 路由設置
router.get('/:category/:page', function(req, res, next) {
	let category = categories[req.params.category]['category']
	let context = {
		nowPosition: category
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
				category: req.params.category,
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
			category: req.params.category,
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
router.get('/:category/:subcategory/:page', function(req, res, next) {
	let category = categories[req.params.category]['category']
	let subcategory = categories[req.params.category][req.params.subcategory]
	let context = {
		nowPosition: `${category} / ${subcategory}`
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
				category: req.params.category,
				subcategory: req.params.subcategory,
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
				console.log(context)
				res.render('products', context)
			})
		})
	} else {
		let perPage = 20
		let skipItem = (req.params.page - 1) * perPage
		context['currentPage'] = req.params.page
		context['perPage'] = perPage
		productSchema.find({
			category: req.params.category,
			subcategory: req.params.subcategory,
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
				    description: product.description
				}
			})
			res.render('products', context)
		})
	}
});

module.exports = router;
