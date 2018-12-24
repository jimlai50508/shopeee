var express = require('express');
var router = express.Router();
// 引入schema
var memberSchema = require('../schema/member.js');
var productSchema = require('../schema/product.js');
// 引入並使用session
var session = require('../resource/session/main.js');
router.use(session)
// 引入s3
var s3 = require('../resource/amazon/s3.js')

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
router.get('/', function(req, res,next) {
	res.redirect('/product/page/1')
})
router.get('/page/:page', function(req, res, next) {
	let context = {
		nowPosition: '所有商品'
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
router.get('/:productToken', function(req, res, next) {
	let context = {
		nowPosition: 'Product'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		memberSchema.findOne({username: req.session.username}, function(err, data) {
			let favorite = data.favorite
			productSchema.findOne({
				productToken: req.params.productToken
			}, function(err, data) {
				context['nowPosition'] = data.product
				context['product'] = {
					product: data.product,
					seller: data.seller,
				    images: data.images,
				    price: data.price,
				    stock: data.stock,
				    productToken: data.productToken,
				    description: data.description,
				    category: `${categories[data.category]['category']} / ${categories[data.category][data.subcategory]}`,
				    favorite: favorite.includes(data.productToken)
				}
				console.log(context)			
				res.render('product', context)
			})
		})
	} else {
		productSchema.findOne({
			productToken: req.params.productToken
		}, function(err, data) {
			context['nowPosition'] = data.product
			context['product'] = {
				product: data.product,
				seller: data.seller,
			    images: data.images,
			    price: data.price,
			    stock: data.stock,
			    productToken: data.productToken,
			    category: `${categories[data.category]['category']} / ${categories[data.category][data.subcategory]}`,
			    description: data.description,
			}
			console.log(context)			
			res.render('product', context)
		})
	}
});
router.get('/edit/:editToken', function(req, res, next) {
	let context = {
		nowPosition: 'Edit'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		productSchema.findOne({
			seller: req.session.username,
			editToken: req.params.editToken
		}, function(err, data) {
			context['product'] = data
			res.render('edit', context)
		})
	} else {
		res.redirect('/login')
	}
})
router.get('/delete/:deleteToken', function(req, res, next) { 
	let context = {
		nowPosition: 'Delete'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		productSchema.findOne({
			seller: req.session.username,
			deleteToken: req.params.deleteToken
		}, function(err, data) {
			// data.favoriter為將此商品設為我的最愛的使用者陣列，從該使用者的favorite清單刪除此商品
			data.favoriter.forEach(favoriter=> {
				memberSchema.update({
					username: favoriter
				}, {
					$pull: {favorite: data.productToken}
				}, function(err) {
					if (err) throw err
				})
			})
			// 綁定s3upload module裡面的promise和function，刪除s3圖片檔
			s3.bucketPromise.then(s3.deleteImage.bind(this))
			data.images.forEach(image=> {
				s3.deleteImage(image)
			})
		})
		.then(function(data){
			data.remove()
			res.redirect('/member')
		})
	} else {
		res.redirect('/login')
	}
})
// ajax設置
router.post('/addTofavorite/:productToken', function(req, res, next) {
	if (req.session.login) {
		productSchema.update({
			productToken: req.params.productToken
		}, {
			$addToSet: {favoriter: req.session.username}
		})
		.then(function() {
			memberSchema.update({
				username: req.session.username,
			}, {
				// push容許重複, addToSet不容許重複
				$addToSet: {favorite: req.params.productToken}
			}, function(err, tank) {
				if (err) throw err
				res.send(true)
			})
		})
	} else {
		res.send(false)
	}
})
router.post('/removeFromFavorite/:productToken', function(req, res, next) {
	if (req.session.login) {
		productSchema.update({
			productToken: req.params.productToken
		}, {
			$pull: {favoriter: req.session.username}
		})
		.then(function() {
			memberSchema.update({
				username: req.session.username,
			}, {
				// pull抽出資料
				$pull: {favorite: req.params.productToken}
			}, function(err, tank) {
				if (err) throw err
				res.send(true)
			})
		})
	} else {
		res.send(false)
	}
})

module.exports = router;