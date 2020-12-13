import $ from 'jquery';
import waitForElement from 'wait-for-element';

const get_format = ($wrapper) => {
	const text = $wrapper.text();
	const isMixin = /mixin|include/i.test(text);
	return isMixin ? 'mixin' : 'classes';
};

class DemoCode {
	constructor(elem) {
		this.$wrapper = $(elem);
		this.type = this.get_type();
		this.format = get_format(this.$wrapper);
		if (this.type === 'html' && this.format === 'classes') {
			this.add_html_class();
		} else if (this.type === 'scss' && this.format === 'mixin') {
			this.add_mixin_wrap_setting();
		}
	}

	get_type() {
		const classes = this.$wrapper.attr('class');
		const result = /\s([A-z]+)$/.exec(classes);
		return result[1];
	}

	add_html_class() {
		waitForElement('.hljs-string').then(() => {
			const $hljsStrings = this.$wrapper.find('.hljs-string');
			const $filtered = $hljsStrings.filter((i, elem) => {
				const text = $(elem).text();
				const isInitialiser = text.indexOf('grid ') > -1;
				const hasColumns = text.indexOf('grid--cols-') > -1;
				const isVertical = text.indexOf('grid--vertical') > -1;
				return isInitialiser && hasColumns && !isVertical;
			});
			$filtered.each(function () {
				const text = $(this).text();
				const newText = text.replace(/"$/g, ' grid--wrap"');
				$(this).text(newText);
			});
		});
	}

	add_mixin_wrap_setting() {
		const html = this.$wrapper.html();
		if (
			html.indexOf('<span class="hljs-variable">$wrap</span>: false') === -1
		) {
			//short hand version
			let newHTML = html.replace(
				/include<\/span> grid\(<span class="hljs-number">(.+)\)/gi,
				'include</span> grid(<span class="hljs-number">$1, <span class="hljs-variable">$wrap</span>: true)'
			);

			//long hand version
			newHTML = newHTML.replace(
				/include<\/span> grid\(<span class="hljs-variable">\$cols<\/span>: (.+)\)/gi,
				'include</span> grid(<span class="hljs-variable">$cols</span>: $1, <span class="hljs-variable">$wrap</span>: true)'
			);

			if (html.indexOf('.mixin-13</span>') > -1) {
				const prevHTML =
					'@<span class="hljs-keyword">include</span> grid(<span class="hljs-number">3</span>, <span class="hljs-variable">$MQs</span>: false';
				newHTML = html.replace(
					prevHTML,
					prevHTML + ', <span class="hljs-variable">$wrap</span>: true'
				);
			}
			this.$wrapper.html(newHTML);
		}
	}
}

class DemoResult {
	constructor(resultElem) {
		this.$result = $(resultElem);
		this.format = get_format(this.$result);

		if (this.format === 'classes') {
			this.add_wrap_class();
		}
	}

	add_wrap_class() {
		const $grids = this.$result.find(
			'> * > .grid, > .grid, > figure > * > .grid'
		);

		const $wraps = $grids.filter(function () {
			const hasCols = $(this).attr('class').indexOf('grid--cols') > -1;
			return hasCols;
		});

		$wraps.not('.grid--noWrap').not('grid--vertical').addClass('grid--wrap');
	}
}

class Demo {
	constructor(demoElem) {
		this.$demo = $(demoElem);
		this.$results = this.$demo.find('.demo__result');
		this.$codeBlocks = this.$demo.find('.demo__markup');
		this.$summary = this.$demo.find('.demo__summary');
		this.id = this.$demo.attr('id');

		if (this.can_modify()) {
			this.results = this.gather_classes(this.$results, DemoResult);
			this.codeBlocks = this.gather_classes(this.$codeBlocks, DemoCode);
		}
	}

	can_modify() {
		const excluded_ids = ['11-horizontal-cell-alignments-3'];
		const canModify = excluded_ids.indexOf(this.id) < 0;
		return canModify;
	}

	gather_classes($elem, Cls) {
		const classArray = [];

		$elem.each((i, elem) => {
			const Class = new Cls(elem);
			classArray.push(Class);
		});

		return classArray;
	}
}

export default function () {
	const excludedPages = [
		'/pages/04-using-columns/',
		'/pages/05-control-wrapping/',
		'/pages/09-nesting-grids/',
		'/pages/12-vertical-cell-alignments/',
	];

	if (
		!Modernizr.flexbox &&
		excludedPages.indexOf(window.location.pathname) === -1
	) {
		$('.demo').each(function () {
			new Demo(this);
		});
	}
}
