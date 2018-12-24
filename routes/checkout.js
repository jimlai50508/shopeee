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
		nowPosition: 'Checkout'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		res.render('checkout', context);
	} else {
		res.redirect('/login')
	}
});
router.post('/', function(req, res, next) {
	let context = {
		nowPosition: 'Checkout'
	}
	if (req.session.login) {
		context['login'] = true
		context['username'] = req.session.username
		let objs = JSON.parse(req.body.data)
		let orderData = new Object()
		let date = new Date(new Date().getTime()+(1000 * 60 * 60 * 8))
		let time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
		orderData['time'] = time
		orderData['total'] = objs.map(obj=> obj.subtotal).reduce((a, b) => a + b, 0)
		orderData['datas'] = []
		objs.forEach(obj=> {
			console.log('obj: '+JSON.stringify(obj))
			if (orderData['datas'].find(i=> {return i.seller == obj.seller}) == undefined) {
				orderData['datas'].push({
					seller: obj.seller,
					items: [obj]
				})
			} else {
				let index = orderData['datas'].findIndex(i=> {
					return i.seller == obj.seller
				})
				orderData['datas'][index]['items'].push(obj)
			}
			productSchema.findOneAndUpdate({
				product: obj.product,
				stock: { $gte : obj.number}
			}, {
				$inc: { stock: -obj.number}
			}, function(err) {
				if (err) throw err
				// 2. 後發生
			})
		})
		orderSchema.create({
			time: orderData['time'],
			buyer: req.session.username,
			total: orderData['total'],
			datas: orderData['datas']
		}, function(err) {
			if (err) throw err
			context['message'] = '完成訂單，可於帳號管理查詢訂單資料。'
			res.render('message', context)
			// 1. 先發生，有空用promise處理一下
		})
	} else {
		res.redirect('/login')
	}
});

module.exports = router;
