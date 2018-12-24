let selectCategory = function(){
	let current = $('.category').val()
	let subcategory = $('.subcategory')
	let elmt = ''
	if (current == 'food') {
		elmt = `
			<option selected disabled>---</option>
			<option value='giftbox'>禮盒、伴手禮</option>
			<option value='snack'>餅乾、零嘴</option>
			<option value='instantfood'>熟食、即食</option>
			<option value='beverage'>飲料、沖泡</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'male') {
		elmt = `
			<option selected disabled>---</option>
			<option value='top'>上衣、T恤</option>
			<option value='shirt'>上衣、襯衫</option>
			<option value='pants'>長褲、短褲</option>
			<option value='jacket'>外套、大衣</option>
			<option value='accessory'>鞋包、配件</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'female') {
		elmt = `
			<option selected disabled>---</option>
			<option value='top'>上衣、T恤</option>
			<option value='shirt'>上衣、襯衫</option>
			<option value='pants'>長褲、短褲</option>
			<option value='jacket'>外套、大衣</option>
			<option value='accessory'>鞋包、配件</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'life') {
		elmt = `
			<option selected disabled>---</option>
			<option value='kitchen'>廚房、餐具</option>
			<option value='furniture'>家具、收納</option>
			<option value='room'>房間、臥室</option>
			<option value='tool'>工具、配件</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'entertainment') {
		elmt = `
			<option selected disabled>---</option>
			<option value='game'>遊戲、電玩</option>
			<option value='exhibition'>展覽、教育</option>
			<option value='activity'>活動、票券</option>
			<option value='other'>其它</option>
		`
	} else if (current == '3c') {
		elmt = `
			<option selected disabled>---</option>
			<option value='nb'>筆記型電腦</option>
			<option value='pc'>桌上型電腦</option>
			<option value='phone'>手機、平板</option>
			<option value='hardware'>周邊、硬體</option>
			<option value='appliance'>家電、電器</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'sport') {
		elmt = `
			<option selected disabled>---</option>
			<option value='outdoor'>戶外、活動</option>
			<option value='clothes'>服飾、衣著</option>
			<option value='accessory'>配件、訓練</option>
			<option value='sport'>運動</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'book') {
		elmt = `
			<option selected disabled>---</option>
			<option value='textbook'>教科書</option>
			<option value='magazine'>雜誌</option>
			<option value='literature'>小說、文學</option>
			<option value='science'>科普、自然</option>
			<option value='business'>商業、經濟</option>
			<option value='life'>生活、旅遊</option>
			<option value='disign'>藝術、設計</option>
			<option value='other'>其它</option>
		`
	} else if (current == 'other') {
		elmt = `
			<option selected disabled>---</option>
			<option value='helpbuy'>代購</option>
			<option value='buytogether'>團購</option>
			<option value='customize'>客製化</option>
			<option value='other'>其它</option>
		`
	} 
	$('.subcategory').children().remove()
	$('.subcategory').append(elmt)
}