$(document).ready(function() {
	// 將cart隱藏
	$('.cart').css({'display': 'none'})
	// 取得所有key放入array，並刪除"sellerTotal"，留下productToken
	let indexes = []
	for (var i=0; i<sessionStorage.length; i++) {
		indexes.push(sessionStorage.key(i))
	}
	indexes.splice(indexes.indexOf('sellerTotal'), 1)
	// 將商品資料轉換為object並放入陣列
	let items = new Object()
	indexes.forEach(token=> {
		let str = sessionStorage.getItem(token)
		let obj = JSON.parse(str)
		if (items[obj.seller] == undefined) {
			items[obj.seller] = []
			items[obj.seller].push(obj)
		} else {
			items[obj.seller].push(obj)
		}
	})
	// append到html頁面上
	let sellers = Object.keys(items)
	sellers.forEach(seller=> {
		let sellerTotal = JSON.parse(sessionStorage.getItem('sellerTotal'))
		let elmtChecklist = $('<div>').addClass('checklist')
		let elmtTitle = $('<div>').addClass(`seller ${seller}`).text(seller)
		let elmtTotal = $('<div>').addClass(`total ${seller}`).text(`總計: ${sellerTotal[seller]}`)
		elmtChecklist.append(elmtTitle)
		elmtChecklist.append(elmtTotal)
		items[seller].forEach(item=> {
			let elmtCheckItem = $('<div>').addClass(`checkItem ${item.productToken}`)
			// html第一行的stockShort沒有作用 因為庫存為0時不能加入購物車 相關函式stockShort, isSoldout
			elmtCheckItem.html(`
				<div class='${stockShort(item.stock, item.number)}'>
					<div class='topSection'>
						<div class='remove fas fa-trash' onclick='removeItem("${item.productToken}", "${seller}"), refreshCount()'></div>
						<div class='subtotal'>小計 ${item.subtotal}</div>
					</div>
					<div class='bottomSection'>
						<div class='leftSection'>
							<div>商品
								<a href='/product/${item.productToken}'>${item.product}</a>
							</div>
							<div>$ ${item.price}</div>
							<div>數量
								<input class='number' type='number' value='${item.number}' min='1', max='${item.stock}' onchange='getTotal("${item.productToken}"), refreshTotal("${item.productToken}", "${seller}"), isSoldout("${item.productToken}")'/>
							</div>
							<div>庫存 ${item.stock}</div>
							<div class='description'>${item.description}</div>
						</div>
						<div class='rightSection'>
							<img src='https://s3.amazonaws.com/fakeshopee/${item.images[0]}'>
						</div>
					</div>
				</div>
			`)
			elmtChecklist.append(elmtCheckItem)
		})
		$('.checkout').append(elmtChecklist)
	})
	let sellerTotal = JSON.parse(sessionStorage.getItem('sellerTotal'))
	let sum = Object.values(sellerTotal).reduce((a, b) => a + b, 0)
	let elmtSum = $('<div>').addClass('sum').text(`總金額: ${sum}`)
	$('.checkout').append(elmtSum)
	let form = $('<form>').addClass('form').attr({
		method: 'post',
		action: '/checkout'
	})
	// 檢查頁面讀取時是否沒有任何商品
	let checkIfNoItem = function() {
		if (sum == 0) {
			return ['disabled', 'display']
		} else {
			return ['', 'none']
		}
	}
	form.html(`
		<div class='ifNoItem' style='display: ${checkIfNoItem()[1]}'>尚未選取任何商品</div>
		<input class='data' name='data' style='display: none'></input>
		<button type='submit' onclick='sessionStorage.clear()' ${checkIfNoItem()[0]}>結帳囉</button>
	`)
	$('.checkout').append(form)
	refreshForm()
});

// 呼叫getSubtotal
let getTotal = function(productToken) {
	getSubtotal(productToken)
}
let getSubtotal = function(productToken) {
	let item = JSON.parse(sessionStorage.getItem(productToken))
	let number = $(`.${productToken} .number`).val()
	let subtotal = 0
	number = parseInt(number)
	item['number'] = number
	item['subtotal'] = item['number'] * item['price']
	subtotal = item['subtotal']
	item = JSON.stringify(item)
	sessionStorage.setItem(productToken, item)
	getSellerTotal()
}
let refreshTotal = function(productToken, seller) {
	let storageProduct = JSON.parse(sessionStorage.getItem(productToken))
	subtotal = storageProduct['subtotal']
	$(`.${productToken} .subtotal`).text(subtotal)
	let storageSellerTotal = JSON.parse(sessionStorage.getItem('sellerTotal'))
	let sellerTotal = storageSellerTotal[seller]
	$(`.total.${seller}`).text(`總計: ${sellerTotal}`)
	let sum = Object.values(storageSellerTotal).reduce((a, b) => a + b, 0);
	$('.sum').text(`總金額: ${sum}`)
	refreshForm()
}
// 在checkout頁面移除商品
let removeItem = function(productToken, seller) {
	$(`.${productToken}`).remove()
	sessionStorage.removeItem(productToken)
	getSellerTotal()
	let storageSellerTotal = JSON.parse(sessionStorage.getItem('sellerTotal'))
	let sellerTotal = storageSellerTotal[seller]
	$(`.total.${seller}`).text(`總計: ${sellerTotal||0}`)
	let sum = Object.values(storageSellerTotal).reduce((a, b) => a + b, 0);
	if (sum == 0) {
		$('.ifNoItem').css({'display': 'block'})
		$('button').prop({'disabled': true})
	}
	$('.sum').text(`總金額: ${sum}`)
	refreshForm()
}
// 更新表單
let refreshForm = function(){
	// 取得所有key放入array，並刪除"sellerTotal"，留下productToken
	let indexes = []
	for (var i=0; i<sessionStorage.length; i++) {
		indexes.push(sessionStorage.key(i))
	}
	indexes.splice(indexes.indexOf('sellerTotal'), 1)
	let data = []
	indexes.map(index=> {
		data.push(JSON.parse(sessionStorage.getItem(index)))
	})
	$('form>.data').val(JSON.stringify(data))
}
// 頁面載入時檢查是否購買數量超過數存
let stockShort = function(stock, number) {
	if (stock < number) {
		return 'soldout'
	} else {
		return 'inStock'
	}
}
// 改變數量時檢查是否購買數量超過數存
let isSoldout = function(productToken) {
	let number = parseInt($(`.${productToken} .number`).val())
	let stock = parseInt($(`.${productToken} .stock`).text())
	if (number <= stock) {
		$(`.${productToken}>div`).removeClass('soldout')
		return false
	} else if (number >= stock) {
		$(`.${productToken}>div`).addClass('soldout')
		return true
	}
}

