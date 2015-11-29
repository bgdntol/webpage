var myModule = ( function () {

	var init = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		$('#add-new-item').on('click', _showModal);
		$('#add-new-project').on('submit', _addProject);
	};

	var _showModal = function(e) {
		console.log('Вызов модального окна');
		e.preventDefault();
		$('#new-project-popup').bPopup({
			speed: 650,
			transition: 'slideDown'
		});
	};

	var _addProject = function(e) {
		console.log('Проверка формы');
		e.preventDefault();

		var form = $(this),
			url = 'add_project.php',
			data = form.serialize();

		console.log(data);

		$.ajax({
			url: '/path/to/file',
			type: 'POST',
			dataType: 'json',
			data: data,
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	};

	return {
		init : init
	};
})();

myModule.init();



var addProject = (function (){

	// Инициализация проекта
	var init = function(){
		_setUpListners();
  };

  // Прослушка событий
	var _setUpListners = function (){
		$('#add-new-project').on('submit', _addProject); // добавление проекта
		$('#fileupload').on('change', _changefileUpload);
	};

	// Изменили файл аплоад (добавили файл в файлаплоад)
	var _changefileUpload = function (){
		var input = $(this), // инпут type="file"
				name = input[0].files[0].name; // имя загруженного файла
		$('#filename')
			.val(name) // 
			.trigger('hideTooltip')
			.removeClass('errors'); 
	};

	var _addProject = function (ev){

	      ev.preventDefault();

	      var form = $(this),
	          url = './actions/add-project.php',
	          defObject = _ajaxForm(form, url);

	      if (defObject) {
	    		// ...дальнейшие действия с ответом с сервера
	      }
    	};

	var _ajaxForm = function (form, url) {

	      if (!validation.validateForm(form)) return false;  // Возвращает false, если не проходит валидацию
	      var data = form.serialize(); // собираем данные из формы в объект data

	      return $.ajax({ // Возвращает Deferred Object
	        type: 'POST',
	        url: url,
	        dataType : 'JSON',
	        data: data
	      }).fail( function(ans) {
	        console.log('Проблемы в PHP');
	        form.find('.error-mes').text('На сервере произошла ошибка').show();
	      });
	};

	return {
		init: init
	};

})();

addProject.init();



//placeholder для 
$(document).ready(function() {
	/* Placeholder for IE */
	if($.browser.msie) { // Условие для вызова только в IE
		$("form").find("input[type='text'], input[type='mail'], textarea[type='text']").each(function() {
			var tp = $(this).attr("placeholder");
			$(this).attr('value',tp).css('color','#54cee9');
		}).focusin(function() {
			var val = $(this).attr('placeholder');
			if($(this).val() == val) {
				$(this).attr('value','').css('color','#54cee9');
			}
		}).focusout(function() {
			var val = $(this).attr('placeholder');
			if($(this).val() == "") {
				$(this).attr('value', val).css('color','#54cee9');
			}
		});

		/* Protected send form */
		$("form").submit(function() {
			$(this).find("input[type='text']").each(function() {
				var val = $(this).attr('placeholder');
				if($(this).val() == val) {
					$(this).attr('value','');
				}
			})
		});
	}
});