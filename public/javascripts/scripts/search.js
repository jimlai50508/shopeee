let getSearch = function() {
	let searchInput = $('#searchInput').val()
	$('#searchForm').attr({onsubmit: `window.location="/search/${searchInput}/1"; return false`})
}