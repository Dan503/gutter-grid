import $ from 'jquery';
import waitForElement from 'wait-for-element';

const get_format = ($wrapper) => {
	const text = $wrapper.text();
	const isMixin = /mixin|include/i.test(text);
	return isMixin ? 'mixin' : 'classes';
}

class DemoCode {
	constructor(elem){
		this.$wrapper = $(elem);
		this.type = this.get_type();
		this.format = get_format(this.$wrapper);
		console.log(this);
		if (this.type === 'html' && this.format === 'classes'){
			this.add_html_class();
		} else if (this.type === 'scss' && this.format === 'mixin') {
			this.add_mixin_setting();
		}
	}

	get_type(){
		const classes = this.$wrapper.attr('class');
		const result = /\s([A-z]+)$/.exec(classes);
		return result[1];
	}

	add_html_class(){
		waitForElement('.hljs-string').then(()=>{
			const $hljsStrings = this.$wrapper.find('.hljs-string');
			const $filtered = $hljsStrings.filter((i,elem) => {
				return $(elem).text().indexOf('grid ') > -1;
			})
			$filtered.each(function(){
				const text = $(this).text();
				const newText = text.replace(/"$/g, ' grid--wrap"');
				$(this).text(newText);
			});
		})
	}

	add_mixin_setting(){
		const $hljsStrings = this.$wrapper.find('.hljs-string');
	}
}

class DemoResult {
	constructor(resultElem){
		this.$result = $(resultElem);
		this.format = get_format(this.$result);

		if (this.format === 'classes') {
			this.add_wrap_class();
		}
	}

	add_wrap_class(){
		const $grids = this.$result.find('> * > .grid, > .grid');

		const $wraps = $grids.filter(function(){
			return $(this).attr('class').indexOf('grid--cols') > -1;
		})

		$wraps.not('.grid--noWrap').addClass('grid--wrap');
	}
}

class Demo {
	constructor(demoElem){
		this.$demo = $(demoElem);
		this.$results = this.$demo.find('.demo__result');
		this.$codeBlocks = this.$demo.find('.demo__markup');
		this.results =  this.gather_classes(this.$results, DemoResult);
		this.codeBlocks = this.gather_classes(this.$codeBlocks, DemoCode);
	}

	gather_classes($elem, Cls){
		const classArray = [];

		$elem.each((i,elem)=>{
			const Class = new Cls(elem);
			classArray.push(Class);
		});

		return classArray;
	}
}

export default function(){
	if (
		!Modernizr.flexbox &&
		window.location.pathname !== '/pages/05-control-wrapping/'
	){
		$('.demo').each(function(){
			new Demo(this);
		})
	}
}
