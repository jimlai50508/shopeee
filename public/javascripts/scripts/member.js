$(document).ready(function() {
	// 預設隱藏所有區塊、顯示個人賣場
	$('[class^=my]').css({display: 'none'})
	$('.myProduct').css({display: 'flex'})
	$('.optProduct').addClass('optSelected')
});
let changeOpt = function(selector) {
	// 隱藏所有區塊、顯示選擇的區塊
	$('[class^=my]').css({display: 'none'})
	$(`.my${selector}`).css({display: 'flex'})
	// 取消所有選項樣式、增加樣式至選擇的選項
	$('[class^=opt]').removeClass('optSelected')
	$(`.opt${selector}`).addClass('optSelected')
}