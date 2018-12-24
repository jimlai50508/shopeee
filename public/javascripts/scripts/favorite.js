let addToFavorite = function(productToken) {
	$.ajax({
		url: `/product/addTofavorite/${productToken}`,
		method: 'POST',
		success: function(res) {
			$(`#add_${productToken}`).css({'display': 'none'})
			$(`#remove_${productToken}`).css({'display': 'inline-block'})
			console.log(res)
		}
	})
}

let removeFromFavorite = function(productToken) {
	$.ajax({
		url: `/product/removeFromFavorite/${productToken}`,
		method: 'POST',
		success: function(res) {
			$(`#add_${productToken}`).css({'display': 'inline-block'})
			$(`#remove_${productToken}`).css({'display': 'none'})
			console.log(res)
		}
	})
}

let elementRemove = function(productToken) {
	$(`.product.product${productToken}`).remove()
}