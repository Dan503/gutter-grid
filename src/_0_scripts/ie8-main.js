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



	// CODE MODIFICATION

	var get_format = function get_format($wrapper) {
		var text = $wrapper.text();
		var isMixin = /mixin|include/i.test(text);
		return isMixin ? 'mixin' : 'classes';
	};
	
	function DemoCode(elem) {

		this.$wrapper = $(elem);

		this.get_type = function(){
			var classes = this.$wrapper.attr('class');
			var result = /\s([A-z]+)$/.exec(classes);
			return result[1];
		}

		this.add_html_class = function(){
			var _this = this;

			var html = _this.$wrapper.html();

			var regex = /&lt;div class="grid grid--cols-([A-z0-9 -]*)"&gt;/gi;
			var replacement = html.replace(regex, '&lt;div class="grid grid--cols-$1 grid--wrap"&gt;');
			// console.log('original', html);
			// console.log('replacement', replacement);
			_this.$wrapper.html(replacement);
		}

		this.add_mixin_wrap_setting = function(){
			var html = this.$wrapper.html();
			if (html.indexOf('$wrap: false') === -1) {
				var newHTML = html.replace(/include grid\((.+)\)/gi, 'include grid($1, $wrap: true)');
				if (html.indexOf('.mixin-13 ') > -1) {
					var prevHTML = '@include grid(3, $MQs: false';
					newHTML = html.replace(prevHTML, prevHTML + ', $wrap: true');
				}
				this.$wrapper.html(newHTML);
			}
		}

		this.type = this.get_type();
		this.format = get_format(this.$wrapper);

		if (this.type === 'html' && this.format === 'classes') {
			this.add_html_class();
		} else if (this.type === 'scss' && this.format === 'mixin') {
			this.add_mixin_wrap_setting();
		}
	}

	function DemoResult(resultElem) {
		this.$result = $(resultElem);
		this.format = get_format(this.$result);

		this.add_wrap_class = function(){
			var $grids = this.$result.find('> * > .grid, > .grid, > figure > * > .grid');

			var $wraps = $grids.filter(function () {
				var hasCols = $(this).attr('class').indexOf('grid--cols') > -1;
				return hasCols;
			});

			$wraps.not('.grid--noWrap').not('grid--vertical').addClass('grid--wrap');
		}

		if (this.format === 'classes') {
			this.add_wrap_class();
		}
	}

	function Demo (demoElem) {

		this.$demo = $(demoElem);
		this.$results = this.$demo.find('.demo__result');
		this.$codeBlocks = this.$demo.find('.demo__markup');
		this.id = this.$demo.attr('id');

		this.can_modify = function(){
			var excluded_ids = [
				'11-horizontal-cell-alignments-3',
			];
			return !isExcluded(excluded_ids, this.id);
		}

		this.gather_classes = function($elem, Cls){
			var classArray = [];

			$elem.each(function (i, elem) {
				var Class = new Cls(elem);
				classArray.push(Class);
			});

			return classArray;
		}

		if (this.can_modify()) {
			this.results = this.gather_classes(this.$results, DemoResult);
			this.codeBlocks = this.gather_classes(this.$codeBlocks, DemoCode);
		}

	};

	var excludedPages = [
		'/pages/04-using-columns/',
		'/pages/05-control-wrapping/',
		'/pages/09-nesting-grids/',
		'/pages/10-borders-and-shadows-on-guttered-cells/',
		'/pages/12-vertical-cell-alignments/',
	];

	if (
		!Modernizr.flexbox &&
		!isExcluded(excludedPages, window.location.pathname)
	){

		$('.demo').each(function () {
			new Demo(this);
		});
	}

});

function isExcluded(exclusionsArray, pathname) {
	for (var i = 0; i < exclusionsArray.length; i++) {
		if (exclusionsArray[i] === pathname) {
			return true;
		}
	}
	return false;
}
