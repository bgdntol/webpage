$(document).ready(function(){
	$('.gallery .slide-list').bxSlider({
		pager: false,
		minSlides: 3,
		maxSlides:5,
		moveSlides:'integer',
		auto: true,
		pause: 2500,
		speed: 1000
	});
	$('.slider .slide-list').bxSlider({
		pager: false,
		auto: true,
		pause: 3000
	});
	$('.slider-type2 .slide-list').bxSlider();
	$('.menu-list .title').click(function(){
		if($(this).closest('li').hasClass('active')){
			$('.menu-list .title').closest('li').removeClass('active');
		} else {
			$('.menu-list .title').closest('li').removeClass('active');
			$(this).closest('li').addClass('active');
		}
		return false;
	});
	$('#nav ul a').click(function() { 
		elementClick = $(this).attr("href");
		destination = $(elementClick).offset().top;
		$('html, body').stop().animate({
			scrollTop: $(elementClick).offset().top-75
		}, 1000);
		return false;
	});
});
