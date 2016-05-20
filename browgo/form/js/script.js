var sliderTimout = 10000;
var incrementer = 100;
var incrementerIPad = 10;
var isiPad = navigator.userAgent.match(/iPad/i) != null;

jQuery.fn.centerPopup = function () {
	var _this = this;
	var visibleAreaHeight = window.innerHeight;
	//var currentPopupHeight = $(this).closest('.overflow').find('.wrapper').actual( 'innerHeight' );
	var currentPopupHeight = 600;
	
	//console.log(visibleAreaHeight);
	//console.log(currentPopupHeight);
	
	var topMargin = incrementer;
	if(visibleAreaHeight <= currentPopupHeight) {
		topMargin = incrementerIPad;
	}
    this.css("margin-top", topMargin + $(window).scrollTop() + "px");
    return this;
}

function slideToNext() {
	if($('.slider .slider-nav .sn-link.active').next('.sn-link').length) {
		$('.slider .slider-nav .sn-link.active').next('.sn-link').children('a').trigger('click');
	}
	else {
		$('.slider .slider-nav .sn-link:first a').trigger('click');
	}
}

$(document).ready(function(){
	// Слайдер имаджэйсновский
	var proccessingSliders = false; 
	$(document).on('click', '.slider .slider-nav .sn-link a', function(event) {
		var _this = $(this);
		if(!proccessingSliders && !_this.parent('.sn-link').hasClass('active')) {
			proccessingSliders = true;
			
			var indexOld = $('.slider-nav .sn-link.active a').attr('rel');
			
	        $(this).closest('.slider-nav').find('.sn-link').removeClass('active');
	        $('.slider .slider-img li[rel="' + indexNew + '"]').addClass('active');
	        _this.parent('.sn-link').addClass('active');
	        var indexNew = $(this).attr('rel');
	        $('.slider .slider-img li[rel="' + indexOld + '"]').fadeOut('normal', function() {
        		$('.slider .slider-img li[rel="' + indexOld + '"]').removeClass('active');
				$('.slider .slider-img li[rel="' + indexNew + '"]').fadeIn('normal', function() {
					proccessingSliders = false;
				});
	        });
		}
		
        return false;
    });
    // Автослайдинг 
    var sliderInterval = 0;
    sliderInterval = setInterval( slideToNext, sliderTimout);
    $('.slider .slider-img li img').hover(function(ev){
    	clearInterval(sliderInterval);
	}, function(ev){
	    sliderInterval = setInterval( slideToNext, sliderTimout);
	});
    
    // Эффекты появления фото для галереи
	var effect = 'animate fade-in';

	var masonry_selector = '.masonry';

	var masonry_item_selector = '.masonry-item';

	// Инициализируем Masonry
	var $masonry = $(masonry_selector)
	    .masonry({
	        itemSelector: masonry_item_selector
	    });

	// Находим скрытые элементы
	var $masonry_items = $masonry
	    .find(masonry_item_selector)
	    .hide();

	// Ждем загрузку изображений
	$masonry
	    .imagesLoaded()
	    // Изображение загружено
	    .progress(function(instance, image) {
	        // Добавляем эффект
	        var $image = $(image.img)
	            .addClass(effect);

	        // Находим и показываем элемент
	        var $item = $image
	            .parents(masonry_item_selector)
	            .show();
	        
	        // Оформляем Masonry
	        $masonry
	            .masonry();
	            
	       $item.removeClass('masonry-item');
	    });
	    
	
	
    // Показать ещё для галереи
    var proccessingGalleryMore = false;
    $(document).on('click', '.show-more-gallery', function(event) {
    	var _this = $(this);
    	if(!proccessingGalleryMore) {
    		proccessingGalleryMore = true;
			var maxId = $(this).children('.fake-link').attr('max_id');
			// Показываем крутилку
			_this.addClass('loading');
			$('#gallery_more_ajax_loader').show();
			_this.children('.fake-link').html('');
			// Идем за следующей порцией данных
			$.ajax({
	            type: "POST",
	            url: "index.php",
	            data: {
	                gallery_ajax: "Y",
	                next_id: maxId
	            }
	        })
	            .done(function (msg) {
	            	var hasNextPagination = false;
	            	$(msg).each(function() {
	            		if($(this).hasClass('gallery')) {
	            			//$($(this)).find('img').addClass(effect);
	            			$(this).find(masonry_item_selector)
	    						.hide();
							$("#gallery_block #gallery").append($(this).html());
	            		}
	            		if($(this).hasClass('show-more-gallery')) {
	            			
							$(".show-more-gallery").html($(this).html());
							hasNextPagination = true;	
	            		}
	            	});
	            	
	            	if(!hasNextPagination)
	            		$(".show-more-gallery").remove();
	            	
	            	// Инициализируем Masonry
					/*var $masonry = $(masonry_selector)
					    .masonry({
					        itemSelector: masonry_item_selector
					    });
					    
				    // Находим скрытые элементы
					var $masonry_items = $masonry
					    .find(masonry_item_selector)
					    .hide();*/
					    
	            	// Ждем загрузку изображений
					$masonry
					    .imagesLoaded()
					    // Изображение загружено
					    .progress(function(instance, image) {
					        // Добавляем эффект
					        var $image = $(image.img)
					            .addClass(effect);

					        // Находим и показываем элемент
					        var $item = $image
					            .parents(masonry_item_selector)
					            .show();

					        $masonry
                            	.masonry('appended', $item);
                            
                            $item.removeClass('masonry-item');
					    });
					
					_this.removeClass('loading');    
	                proccessingGalleryMore = false;
	            });
    	}
		
        return false;
    });
    
    // Показать ещё для блога
    var proccessingBlogMore = false;
    $(document).on('click', '.blog-list-more', function(event) {
    	var _this = $(this);
    	if(!proccessingBlogMore) {
    		proccessingBlogMore = true;
			var page = parseInt($(this).children('.fake-link').attr('page'));
			// Показываем крутилку
			_this.addClass('loading');
			$('#blog_more_ajax_loader').show();
			// Идем за следующей порцией данных
			$.ajax({
	            type: "POST",
	            url: "index.php",
	            data: {
	                blog_ajax: "Y",
	                PAGEN_1: ++page
	            }
	        })
	            .done(function (msg) {
	            	var hasNextPagination = false;
	            	$(msg).each(function() {
	            		if($(this).hasClass('blog-block-item')) {
							$("#blog_block").append($(this).html());
	            		}
	            		if($(this).hasClass('blog-list-more')) {
							$(".blog-list-more").html($(this).html());
							hasNextPagination = true;	
	            		}
	            	});
	            	
	            	if(!hasNextPagination)
	            		$(".blog-list-more").remove();
	            	
	            	_this.removeClass('loading');
	                proccessingBlogMore = false;
	            });
    	}
		
        return false;
    });
    
    
	    
    // Скрытие попапа
    $("body").click(function(e){
        if ($(e.target).is('.overflow, .content, .wrapper, .overflow .close')) {
           $('.overflow').fadeOut();
           $('.wrapper-inner > .main-content').css({'height':'','overflow':''});
        }
        if (!$(e.target).parents().is('.fr-select-wrap')) {
           $('.fr-select-open').slideUp();
        }
    });
    // Галерея, увеличилка
    $(document).on('click', '.gallery-items li a', function(event) {
		var bigPhoto = $(this).attr('rel');
		// Ищем предыдущий и следующий элементы
		var prevPhotoId = 0;
		var nextPhotoId = 0;
		if($(this).closest('li').prev('li').length)
			prevPhotoId = $(this).closest('li').prev('li').find('a').attr('rel');
		if($(this).closest('li').next('li').length)
			nextPhotoId = $(this).closest('li').next('li').find('a').attr('rel');
		else {
			// Для случая, когда следующей из подгруженных фоток нет, но есть кнопка "Показать ещё"
			if($('.show-more-gallery').length) {
				nextPhotoId = 'more';
			}
		}
		// Показываем крутилку
		$('#gallery_ajax_loader').show();
		// Идем за детальной информацией
		$.ajax({
            type: "POST",
            dataType: 'json',
            url: "/ajax/",
            data: {
                request: 'get_media_info',
                media_id: bigPhoto
            }
        })
            .done(function (result) {
            	if(result.data !== undefined) {
            		$('.gallery-info').centerPopup();
            		$('#inst_gallery').fadeIn();
            		$('#inst_gallery .gallery-info .gi-text').html(result.data.caption.text);
            		if(prevPhotoId) {
						$('#inst_gallery .gallery-info .prev').attr('rel', prevPhotoId);	
						$('#inst_gallery .gallery-info .prev').show();	
            		}	
            		else {
            			$('#inst_gallery .gallery-info .prev').attr('rel', 0);
						$('#inst_gallery .gallery-info .prev').hide();
            		}
            		if(nextPhotoId) {
						$('#inst_gallery .gallery-info .next').attr('rel', nextPhotoId);	
						$('#inst_gallery .gallery-info .next').show();	
            		}	
            		else {
            			$('#inst_gallery .gallery-info .next').attr('rel', 0);
						$('#inst_gallery .gallery-info .next').hide();
            		}
            		$('#inst_gallery .gallery-info .gi-image img').attr('src', result.data.images.standard_resolution.url).load(function() {
						$('#gallery_ajax_loader').hide();
            		});
            	}
            });
        return false;
    });
    
    // Галерея, листалка
    var proccessingPrevNext = false;
    $(document).on('click', '#inst_gallery .gallery-info .prev, #inst_gallery .gallery-info .next', function(event) {
    	if(!proccessingPrevNext) {
    		proccessingPrevNext = true;
			var bigPhoto = $(this).attr('rel');
			
			// Показываем крутилку
			$('#gallery_ajax_loader').show();
			if(bigPhoto == 'more') {
				var $finalElement = $('.gallery-items li:last');
				
				$('.show-more-gallery').trigger('click');
				setTimeout(function() {
					var checkUploadPhotosInterval = setInterval(function() {
						if(!proccessingGalleryMore) {
							clearInterval(checkUploadPhotosInterval);
							
							var $currentElement = $finalElement.next().find('a');
							var $currentId = $currentElement.attr('rel');
							// Ищем предыдущий и следующий элементы
							var prevPhotoId = 0;
							var nextPhotoId = 0;
							if($currentElement.closest('li').prev('li').length)
								prevPhotoId = $currentElement.closest('li').prev('li').find('a').attr('rel');
							if($currentElement.closest('li').next('li').length)
								nextPhotoId = $currentElement.closest('li').next('li').find('a').attr('rel');
							
							// Идем за детальной информацией
							$.ajax({
					            type: "POST",
					            dataType: 'json',
					            url: "/ajax/",
					            data: {
					                request: 'get_media_info',
					                media_id: $currentId
					            }
					        })
					            .done(function (result) {
            						if(result.data !== undefined) {
            							if(prevPhotoId) {
											$('#inst_gallery .gallery-info .prev').attr('rel', prevPhotoId);	
											$('#inst_gallery .gallery-info .prev').show();	
            							}	
            							else {
            								$('#inst_gallery .gallery-info .prev').attr('rel', 0);
											$('#inst_gallery .gallery-info .prev').hide();
            							}
            							if(nextPhotoId) {
											$('#inst_gallery .gallery-info .next').attr('rel', nextPhotoId);	
											$('#inst_gallery .gallery-info .next').show();	
            							}	
            							else {
            								$('#inst_gallery .gallery-info .next').attr('rel', 0);
											$('#inst_gallery .gallery-info .next').hide();
            							}
            							$('#inst_gallery .gallery-info .gi-text').html(result.data.caption.text);
            							$('#inst_gallery .gallery-info .gi-image img').attr('src', result.data.images.standard_resolution.url).load(function() {
											$('#gallery_ajax_loader').hide();
            							});
            							proccessingPrevNext = false;
            						}
					            });
						}
					}, 500);
				}, 500);
			}
			else {
				var $currentElement = $('.gallery-items li a[rel="' + bigPhoto + '"]');
				// Ищем предыдущий и следующий элементы
				var prevPhotoId = 0;
				var nextPhotoId = 0;
				if($currentElement.closest('li').prev('li').length)
					prevPhotoId = $currentElement.closest('li').prev('li').find('a').attr('rel');
				if($currentElement.closest('li').next('li').length)
					nextPhotoId = $currentElement.closest('li').next('li').find('a').attr('rel');
				else {
					// Для случая, когда следующей из подгруженных фоток нет, но есть кнопка "Показать ещё"
					if($('.show-more-gallery').length) {
						nextPhotoId = 'more';
					}
				}
				// Идем за детальной информацией
				$.ajax({
		            type: "POST",
		            dataType: 'json',
		            url: "/ajax/",
		            data: {
		                request: 'get_media_info',
		                media_id: bigPhoto
		            }
		        })
		            .done(function (result) {
            			if(result.data !== undefined) {
            				if(prevPhotoId) {
								$('#inst_gallery .gallery-info .prev').attr('rel', prevPhotoId);	
								$('#inst_gallery .gallery-info .prev').show();	
            				}	
            				else {
            					$('#inst_gallery .gallery-info .prev').attr('rel', 0);
								$('#inst_gallery .gallery-info .prev').hide();
            				}
            				if(nextPhotoId) {
								$('#inst_gallery .gallery-info .next').attr('rel', nextPhotoId);	
								$('#inst_gallery .gallery-info .next').show();	
            				}	
            				else {
            					$('#inst_gallery .gallery-info .next').attr('rel', 0);
								$('#inst_gallery .gallery-info .next').hide();
            				}
            				$('#inst_gallery .gallery-info .gi-text').html(result.data.caption.text);
            				$('#inst_gallery .gallery-info .gi-image img').attr('src', result.data.images.standard_resolution.url).load(function() {
								$('#gallery_ajax_loader').hide();
            				});
            				proccessingPrevNext = false;
            			}
		            });	
			}
		}
		
        return false;
    });
    
    // Записаться онлайн
    $(document).on('click', '.header .button', function(event) {
        if($(document).width() < 680){
            $('.wrapper-inner > .main-content').css({'height':'800px','overflow':'hidden'});
        }
    	// Убираем последствия последнего сабмита
    	$('#order_write input[type="submit"]').val('Записаться');
		$('#order_write input[type="submit"]').removeClass('ajax-button-loader');
		$('#order_write input[type="submit"]').removeAttr('disabled');
		// Показываем
		$('.form-popup').centerPopup();
        $('#order_write').fadeIn();
        return false;
    });
    if(window.location.hash=="#show-online"){
        $('.header .button').click();    
    }
        
    // Выбор даты

	$( "#date" ).datepicker({
		minDate: 0, 
		regional: 'ru',
		showOtherMonths: true,
		selectOtherMonths: true,
		duration: 300,
		showAnim: "toggle",
		dateFormat: "dd.mm",
		onSelect: function() {
			$("#date_holder .fr-calendar").removeClass('active');
		},
		onClose: function() {
			$("#date_holder .fr-calendar").removeClass('active');
		},
        onSelect: function(dateText) {
            //display("Selected date: " + dateText + "; input's current value: " + this.value);

            if($("#date_holder .fr-input").data('date')==dateText){ 
                correctInput();
            }else{
                var first_time = '';
                $('#date_holder .time-list li').each(function(){
                    $(this).show();    
                    if(first_time==''){
                        first_time = time_this; 
                        $('#date_holder .fr-date span').text($(this).attr('rel'));  
                    }
                });    
            }
        }
        
	});
    correctInput();
    function correctInput(){
        var now = new Date();
        var formated_date = '';
        var first_time = '';
        if(now.getHours()<10){
            formated_date = '0'+now.getHours();    
        }else{
            formated_date = now.getHours();    
        }
        if(now.getMinutes()<10){
            formated_date = formated_date+'0'+now.getMinutes();    
        }else{
            formated_date = formated_date+''+now.getMinutes();    
        }
        formated_date = parseInt(formated_date);
        $('#date_holder .time-list li').each(function(){
            time_this = parseInt($(this).attr('rel').replace(':',''));
            if(formated_date>time_this){
                $(this).hide();    
            }else{
                if(first_time==''){
                    first_time = time_this; 
                    $('#date_holder .fr-date span').text($(this).attr('rel'));  
                }
            } 
        });
        if(first_time==''){
            $('#date_holder .fr-date span').text('');     
        }    
    }
	// Календарь
	$("#date_holder .fr-calendar").click(function() {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$("#date").datepicker( "hide" );
		} else {
			$(this).addClass('active');
			$("#date").datepicker( "show");
		}
	});
    
	// Кастомный скролл
	$("#scrollable").mCustomScrollbar({
		theme:"minimal"
	});
	// Кастомный скролл дубль 2
	$("#scrollable_time").mCustomScrollbar({
		theme:"minimal",
		setTop:"340px"
	});
	
	// Телефон и дата
	$('#phone').mask("+38(999)999-99-99", {
	    completed: function () {
	        //var currPhone = $(this).val();
		}
	});
	
	// Выпадашка выбора услуг
	/*$(document).on('click', '#select_down', function(event) {
		$(this).parent('.fr-select').toggleClass('active');
		$(this).parent('.fr-select').next('.fr-select-open').slideToggle();
    });*/
    $(document).on('click','.fr-select',function(event) {
        $(this).toggleClass('active');
        $(this).next('.fr-select-open').slideToggle();    
    });
    // Выпадашка выбора времени
	/*$(document).on('click', '#time-down', function(event) {
		$(this).parent('.fr-select').toggleClass('active');
		$(this).parent('.fr-select').next('.fr-select-open').slideToggle();
    });*/
    
   	// Выбор конкретного времени
    $(document).on('click', '#scrollable_time .time-list li', function(event) {
    	var _this = $(this);
		var time = _this.attr('rel');
		$('#time').val(time);
		$('#date_holder .fr-select span').html(time);
		$('#time-down').parent('.fr-select').toggleClass('active');
		$('#time-down').parent('.fr-select').next('.fr-select-open').slideToggle();
    });
    
    // Выбор услуг
    $(document).on('click', '#scrollable .frso-list li', function(event) {
    	var _this = $(this);
		_this.clone().appendTo('#frso_list_top ul');
		_this.hide();
		
		$('#frso_list_top').show();
		
		var fullDescr = '';
		var fullType = '';
		$('#frso_list_top ul li').each(function() {
			var name = $(this).html();
			var type = $(this).attr('rel');
			fullDescr += ', ' + name;
			fullType += ',' + type;
		});
		fullDescr = fullDescr.substring(2);
		fullType = fullType.substring(1);
		$('#frso_block .fr-select span').html(fullDescr);
		$('#type').val(fullType);
    });
    // Отмена услуг
    $(document).on('click', '#frso_list_top .frso-list li', function(event) {
    	var _this = $(this);
		_this.remove();
		$('#scrollable .frso-list li[rel="' + _this.attr('rel') + '"]').show();
		
		if(!$('#frso_list_top .frso-list li').length) {
			$('#frso_list_top').hide();
		}
		
		var fullDescr = '';
		var fullType = '';
		$('#frso_list_top ul li').each(function() {
			var name = $(this).html();
			var type = $(this).attr('rel');
			fullDescr += ', ' + name;
			fullType += ',' + type;
		});
		fullDescr = fullDescr.substring(2);
		fullType = fullType.substring(1);
		$('#frso_block .fr-select span').html(fullDescr);
		$('#type').val(fullType);
    });
    
    // Отправить заявку на запись
	$(document).on('submit', '#order_write_form', function(e) {
		$('#order_write_form input[name="first_name"]').removeClass('error');
		$('#order_write_form input[name="second_name"]').removeClass('error');
		$('#order_write_form input[name="phone"]').removeClass('error').next('.error-text').hide();
		$('#frso_block .fr-select').removeClass('error');

		var errorFlag = false;
		
		var first_name = $('#order_write_form input[name="first_name"]').val();
		var second_name = $('#order_write_form input[name="second_name"]').val();
		var phone = $('#order_write_form input[name="phone"]').val();
		// Адрес проверять не нужно
		var type = $('#order_write_form input[name="type"]').val();
		var date = $('#order_write_form input[name="date"]').val();
		var time = $('#order_write_form input[name="time"]').val();
		
		if(!first_name.length) {
			$('#order_write_form input[name="first_name"]').addClass('error');
		    errorFlag = true;
		}
		if(!second_name.length) {
			$('#order_write_form input[name="second_name"]').addClass('error');
		    errorFlag = true;
		}
		if(!phone.length) {
			$('#order_write_form input[name="phone"]').addClass('error').next('.error-text').css('display', 'inline-block');
		    errorFlag = true;
		}
		if(!type.length) {
			$('#frso_block .fr-select').addClass('error');
		    errorFlag = true;
		}
		
		if(errorFlag) {
			
		}
		else {
			$('#order_write input[type="submit"]').val('');
			$('#order_write input[type="submit"]').addClass('ajax-button-loader');
			$('#order_write input[type="submit"]').attr('disabled', 'disabled');
			
			var postData = $(this).serializeArray();
			$('#order_write .show_err').hide();
			$.ajax({
				type: 'post',
				url: '/ajax/',
				dataType: 'json',
				data: postData,
				success: function(data) {
					if (data.status > 0) {
						$('#order_write').fadeOut('normal', function() {
							$('.thanks-popup').centerPopup();
							$('#order_write_thanks').fadeIn('normal');
							if (data.message)
								$('#order_write_thanks .text').html(data.message);
							
						});
					}
					else {
					    $('#order_write .show_err').text(data.message).show();  
                        $('#order_write input[type="submit"]').removeClass('ajax-button-loader'); 	
                        $('#order_write input[type="submit"]').val('Записаться');
					}
				}
			});
			
			/*
			setTimeout(function() {
				$('#order_write').fadeOut('normal', function() {
					$('.thanks-popup').centerPopup();
					$('#order_write_thanks').fadeIn('normal');
					
				});
			},3000);
			*/
		}
		
		return false;
	});
	// Прилипашка верхнего меню
	/*$(window).scroll(function (event) {
	    var scroll = $(window).scrollTop();
	    // Прикрепляем верхнее меню к потолку
	    if(scroll > 0) {
			$('#unsticked .button').hide();
			$('#sticked').show();
	    }
	    else {
			$('#sticked').hide();
            $('#unsticked .button').show();
			//$('#unsticked').show();
			
	    }
	});*/
	
	// Партнеры
	var oldLvl = 0;
	$(document).on('click', '.partners-row .partner-logo', function(event) {
		var _this = $(this);
		if(!_this.hasClass('empty') && !_this.hasClass('active')) {
			var partner = _this.data('value');
			var lvl = _this.data('lvl');
			
			$('.partners-row .partner-logo').removeClass('active');
			
			
			if(!$('.partner-info').is(':visible')) {
				$('.partner-info[partner="' + partner + '"]').slideDown('normal', function() {
					_this.addClass('active');
				});
			}
			else {
				if(lvl != oldLvl) {
					$('.partner-info:visible').slideUp('normal', function() {
						$('.partner-info[partner="' + partner + '"]').slideDown('normal', function() {
							_this.addClass('active');
						});
					});
				}
				else {
					$('.partner-info:visible').fadeOut('normal', function() {
						$('.partner-info[partner="' + partner + '"]').fadeIn('normal', function() {
							_this.addClass('active');
						});
					});
				}
			}
			
			oldLvl = lvl;
		}
		
        return false;
    });
    
    // Постраничка для блога 
    $(document).on('click', '.blog-more', function(event) {
		var _this = $(this);
    	
        var NavPageCount = parseInt(_this.attr("data-navpagecount")); // 5 всего страниц
        var NavRecordCount = parseInt(_this.attr("data-navrecordcount")); // 15 всего товаров
        var NavPageSize = parseInt(_this.attr("data-navpagesize")); // 3 товаров на странице
        var NavPageNumber = parseInt(_this.attr("data-navpagenumber")); // 2 номер текущей страницы
        
        _this.remove();
        
        data = {
            blog_ajax: "Y",
            PAGEN_1: ++NavPageNumber,
        };
        $.ajax({
            type: "GET",
            url: "index.php",
            data: data
        })
            .done(function (msg) {
                $("#blog_block").append(msg);
            });
       	event.preventDefault();
		
        return false;
    });
    
    
    // Услуги - ракрывашка
    var animationQueue = false;
	$(document).on('click', '.services-item .fake-link', function(event) {
		var _this = $(this).closest('.si-row');
		if(!_this.hasClass('blank') && !animationQueue) {
			animationQueue = true;
			if(_this.hasClass('active')) {
				_this.removeClass('active');
				_this.next('.si-more').slideUp('normal', function() {
					_this.next('.si-more').removeClass('active');
					animationQueue = false;
				});
			}
			else {
				$('.si-row, .si-more').removeClass('active');
				if($('.si-more:visible').length) {
					_this.addClass('active');
					$('.si-more:visible').slideUp('normal', function() {
						_this.next('.si-more').slideDown('normal', function() {
							_this.next('.si-more').addClass('active');
							animationQueue = false;
						});
					});
				}
				else {
					_this.addClass('active');
					_this.next('.si-more').slideDown('normal', function() {
						_this.next('.si-more').addClass('active');
						animationQueue = false;
					});
				}
			}
		}
		
        return false;
    });

    // Скроллинг
    $('.scroll-link').click(function() {
		var top = $('.scroll-target').offset().top;
		var topMargin = $('.header-fixed').outerHeight();
		$("body, html").animate({scrollTop: top-topMargin}, 500, function() {
			if(!$('.scroll-target').hasClass('active'))
				$('.scroll-target').find('.fake-link').trigger('click');
		});		
		return false;
	});


	$('.header .button').click(function() {
		if($('.header .top-nav').length>0) 
			$('#order_write').addClass('m_form-popup');
	});
});