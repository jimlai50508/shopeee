let changeImg = function(src, index){
	let link = `https://s3.amazonaws.com/fakeshopee/${src}`
	$('.mainImg').attr({src: link})
	$('.imgInfo>img').css({border: '2px solid transparent'})
	$(`#img${index}`).css({border: '2px solid grey'})
}