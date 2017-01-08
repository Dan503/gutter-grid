
import $ from 'jquery';

// The point of this function is to make visually hidden things also hidden from screen readers and keyboard users.
// This function does not visually hide anything itself though. It is meant to be used as a suplement to code that visually hides things, not a replacement.
// It will make all links and inputs inside the "$target" not able to be focused on so keyboard users can't tab to them.
// It will also make "$target" hidden from screen reader users
// The first parameter is a jquery element.
// The second parameter is the interactivity state. true = visible, false = hidden, "toggle" = opposite of what is is currently

export default function enableFocus($target, isEnabled){
	if (isEnabled === 'toggle'){
		//disables links
		$target.find('a, [tabindex]').each(function(){
			var tabindex = $(this).attr('tabindex');
			var newTabindex = tabindex == 0 ? -1 : 0;
			$(this).prop('tabindex', newTabindex);

		//disables tabing to inputs
		}).find('input, button').each(function(){
			var isDisabled = $(this).hasAttr('disabled');
			$(this).prop('disabled', !isDisabled);
		});

		//hides the content from screen readers
		var ariaHidden = $target.attr('aria-hidden') || false;
		if (ariaHidden != false) {
			$target.attr('aria-hidden', true);
		} else {
			$target.attr('aria-hidden', false);
		}

	} else if (isEnabled){
		$target.find('a, [tabindex]').prop('tabindex', 0);
		$target.find('input, button').prop('disabled', false);
		$target.attr('aria-hidden', false);
	} else {
		$target.find('a, [tabindex]').prop('tabindex', -1);
		$target.find('input, button').prop('disabled', true);
		$target.attr('aria-hidden', true);
	}
}