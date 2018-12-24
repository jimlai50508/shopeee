$(document).ready(function() {
	sessionStorage.setItem('sellerTotal', 'sellerTotal')
	getSellerTotal()
	let totalNumber = getTotalNumber()
	$('.itemLength').text(`(${totalNumber})`)
});

// 點擊加到購物車時處理sessionStorage 處理各商品
let setStorage = function(token, obj) {
	if (sessionStorage.getItem(token) == null) {
		let item = JSON.parse(obj)
		if (item['stock'] == 0) {
			alert('已無庫存囉')
		} else {
			item['number'] = 1
			item['subtotal'] = item['price'] * item['number']
			item = JSON.stringify(item)
			sessionStorage.setItem(token, item)
		}
	} else {
		let item = JSON.parse(sessionStorage.getItem(token))
		if (item['number'] >= item['stock']) {
			alert('已無庫存囉')
		} else {
			item['number'] += 1
			item['subtotal'] = item['number'] * item['price']
			item = JSON.stringify(item)
			sessionStorage.setItem(token, item)
		}
	} 
}
// 計算sessionStorage中所有item的number總和
let getTotalNumber = function() {
	// 取得所有key放入array，並刪除"sellerTotal"，留下productToken
	let indexes = []
	for (var i=0; i<sessionStorage.length; i++) {
		indexes.push(sessionStorage.key(i))
	}
	indexes.splice(indexes.indexOf('sellerTotal'), 1)
	// 計算各商品的小計
	let total = 0
	indexes.forEach(token=> {
		let obj = JSON.parse(sessionStorage.getItem(token))
		let number = obj['number']
		total += number
	})
	return total
}
// 計算SellerTotal放入sessionStorage
let getSellerTotal = function() {
	// 取得所有key放入array，並刪除"sellerTotal"，留下productToken
	let indexes = []
	for (var i=0; i<sessionStorage.length; i++) {
		indexes.push(sessionStorage.key(i))
	}
	indexes.splice(indexes.indexOf('sellerTotal'), 1)
	// 取得所有product資料
	let allProduct = indexes.map(index=> {
		let strObj = sessionStorage.getItem(index)
		return JSON.parse(strObj)
	})
	// 計算sellerTotal並放入sessionStorage
	let sellerTotalObj = new Object()
	allProduct.forEach(product=> {
		sellerTotalObj[product.seller] = 0
	})
	let sellers = Object.keys(sellerTotalObj)
	sellers.forEach(seller=> {
		let sellerProduct = allProduct.filter(product=> {
			return product.seller == seller
		})
		let total = 0
		sellerProduct.forEach(product=> {
			total += product['subtotal']
		})
		sellerTotalObj[seller] = total
	})
	let item = JSON.stringify(sellerTotalObj)
	sessionStorage.setItem('sellerTotal', item)
}
// 重新計算總數並更新畫面
let refreshCount = function() {
	let totalNumber = getTotalNumber()
	$('.itemLength').text(`(${totalNumber})`)
}
// 清除sessionStorage並更新畫面
let clearStorage = function() {
	sessionStorage.clear()
	$('.itemLength').text('(0)')
}