
import $ from 'jquery';

export default function() {

	//when the user hits the escape key, it will close the tooltip
	$(document).on("keyup", function (e) {
		if (e.which == 27) $('body').click(); //escape key
	});

	//add open class when clicking on the open trigger
	$('body').on('click', '.JS-tooltip__open', function(e){
		$(this).closest('.JS-tooltip').addClass('-isOpen');
		e.stopPropagation();
	});

	//remove open class when clicking outside the tooltip
	$('body').on('click', function(e){
		if(!$(e.target).closest('.JS-tooltip').length){
			$('.JS-tooltip.-isOpen').removeClass('-isOpen');
		}
	});

	//remove the open class when clicking on the close trigger
	$('body').on('click', '.JS-tooltip__close', function(e){
		$(this).closest('.JS-tooltip').removeClass('-isOpen');
		e.stopPropagation();
	});

}
