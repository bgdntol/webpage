 $(function () {
    $('.drop dl').click(function () {
    	$(".dl-drop").hide(500);
        $(this).children(".dl-drop").toggle(500);
    });/*
    $(".hidden-menu li a").click(function(){
    	$(".hidden-menu").css("left", "-85%"),
    	$(".btn-menu").css("left","50px"),
    	$(".btn-menu span.first").css({"-webkit-transform":"rotate(0deg)", " transition":"all .1s linear .23s", "top":"0px"}),
    	$(".btn-menu span.second").css("opacity","1"),
    	$(".btn-menu span.third").css({"-webkit-transform":"rotate(0deg)", "transition":"all .1s linear .23s", "top":"0px"})
    });*/
});