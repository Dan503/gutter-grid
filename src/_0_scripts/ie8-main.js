$(document).ready(function(){

//IE8 tabs code
	var //hooks
	_module = $('.JS-tabs'),
	_content = $('.JS-tabs__content'),
	_triggers = $('.JS-tabs__trigger');

	var //classes
	active_ = '-active';

	//module functionality

	function tabs(elem) {

		var This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$triggers = this.$elem.find('.JS-tabs__trigger');
		this.$content = this.$elem.find('.JS-tabs__content');

		this.$triggers.click(function (e) {
			e.preventDefault();
			switchTab($(this));
		});

		if (typeof window.localStorage.activeTab !== 'undefined') {
			switchTab(window.localStorage.activeTab);
		} else {
			switchTab(0);
		}

		function switchTab(tab) {

			if ($.isNumeric(tab)) {
				tab = This.$triggers.eq(tab);
			}

			var pos = tab.parent().index();

			This.$triggers.filter('.' + active_).removeClass(active_);
			tab.addClass(active_);

			This.$content.hide();
			This.$content.eq(pos).show();

		}
	}

	_module.each(function(e){
		var tabset = new tabs(this);
	})

});