// indexOf polyfill
// Minified version of this:
// https://stackoverflow.com/a/35054662/1611058
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf=function(r){var t=this.length>0,i=Number(arguments[1])||0;for((i=i<0?Math.ceil(i):Math.floor(i))<0&&(i+=t);i<t;i++)if(i in this&&this[i]===r)return i;return-1};
}

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

			var isString = typeof tab === 'string';

			if ($.isNumeric(tab) || isString) {
				if (isString) {
					tab = ['classes','mixin','both'].indexOf(tab);
				}
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