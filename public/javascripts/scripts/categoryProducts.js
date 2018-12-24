$(document).ready(function() {
	let keys = Object.keys(categories)
	let elmtBlock = $('<div>')
	keys.forEach(key=> {
		// 父類別和arrow
		let elmtCategory = $('<div>').addClass(`category ${key}`)
		let arrow = $('<div>')
		.addClass('fas fa-angle-double-right')
		.css({
			'padding-left': '5px',
			display: 'inline-block'
		})
		elmtCategory.html(`<a href='/category/${key}/1'>${hash[key]}</a>`)
		elmtCategory.append(arrow)
		// 子類別
		let elmtSubcategory = $(`<div>`).addClass('subcategory')
		let str = ''
		categories[key].forEach(item=> {
			str += `<a href='/category/${key}/${item[0]}/1'>${item[1]}</a>`
		})
		elmtSubcategory.append(str)
		// 預設全部類別縮和
		elmtSubcategory.slideUp()
		// slideToggle
		arrow.click(function () {
			if ($(this).siblings('.subcategory').is(':visible')) {
				$(this).siblings('.subcategory').slideToggle('slow')
			} else if (!$(this).siblings('.subcategory').is(':visible')) {
				$('.subcategory').slideUp()
				$(this).siblings('.subcategory').slideDown('slow')
			}
            //$(this).siblings('.subcategory').slideToggle('slow');
        });
        elmtCategory.append(elmtSubcategory)
		elmtBlock.append(elmtCategory)
	})
	$('section.category').append(elmtBlock)
});
let hash = {
	food: '美食、禮品',
	male: '男裝、服飾',
	female: '女裝、服飾',
	life: '生活、家居',
	entertainment: '遊戲、娛樂',
	'3c': '家電、3C',
	sport: '運動、戶外',
	book: '書籍、學習',
	other: '其它'
}
let categories = {
	food: [
		['giftbox', '禮盒、伴手禮'],
		['snack', '餅乾、零嘴'],
		['instantfood', '熟食、即食'],
		['beverage', '飲料、沖泡'],
		['other', '其它']
	],
	male: [
		['top', '上衣、T恤'],
		['shirt', '上衣、襯衫'],
		['pants', '長褲、短褲'],
		['jacket', '外套、大衣'],
		['accessory', '鞋包、配件'],
		['other', '其它']
	],
	female: [
		['top', '上衣、T恤'],
		['shirt', '上衣、襯衫'],
		['pants', '長褲、短褲'],
		['jacket', '外套、大衣'],
		['accessory', '鞋包、配件'],
		['other', '其它']
	],
	life: [
		['kitchen', '廚房、餐具'],
		['furniture', '家具、收納'],
		['room', '房間、臥室'],
		['tool', '工具、配件'],
		['other', '其它']
	],
	entertainment: [
		['game', '遊戲、電玩'],
		['exhibition', '展覽、教育'],
		['activity', '活動、票券'],
		['other', '其它']
	],
	'3c': [
		['nb', '筆記型電腦'],
		['pc', '桌上型電腦'],
		['phone', '手機、平板'],
		['hardware', '周邊、硬體'],
		['appliance', '家電、電器'],
		['other', '其它']
	],
	sport: [
		['outdoor', '戶外、活動'],
		['clothes', '服飾、衣著'],
		['accessory', '配件、訓練'],
		['sport', '運動'],
		['other', '其它']
	],
	book: [
		['textbook', '教科書'],
		['magazine', '雜誌'],
		['literature', '小說、文學'],
		['science', '科普、自然'],
		['business', '商業、經濟'],
		['life', '生活、旅遊'],
		['disign', '藝術、設計'],
		['other', '其它']
	],
	other: [
		['helpbuy', '代購'],
		['buytogether', '團購'],
		['customize', '客製化'],
		['other', '其它']
	]
}