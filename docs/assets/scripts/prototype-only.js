!(function u(f, l, r) {
	function d(t, e) {
		if (!l[t]) {
			if (!f[t]) {
				var n = 'function' == typeof require && require;
				if (!e && n) return n(t, !0);
				if (a) return a(t, !0);
				var o = new Error("Cannot find module '" + t + "'");
				throw ((o.code = 'MODULE_NOT_FOUND'), o);
			}
			var i = (l[t] = { exports: {} });
			f[t][0].call(
				i.exports,
				function (e) {
					return d(f[t][1][e] || e);
				},
				i,
				i.exports,
				u,
				f,
				l,
				r
			);
		}
		return l[t].exports;
	}
	for (
		var a = 'function' == typeof require && require, e = 0;
		e < r.length;
		e++
	)
		d(r[e]);
	return d;
})(
	{
		1: [
			function (e, o, i) {
				(function (e) {
					'use strict';
					Object.defineProperty(i, '__esModule', { value: !0 }),
						(i.default = function () {
							var e = (0, f.default)('.JS-templateList__trigger'),
								t = (0, f.default)('.JS-templateList__link'),
								n = (0, f.default)('.JS-templateList__closer'),
								o = (0, f.default)('.JS-templateList__target'),
								i = (0, f.default)('.JS-templateList__target');
							function u(e, t) {
								t && t.preventDefault();
								var n = '-isOpen';
								return {
									open: function () {
										o.addClass(n), i.focus();
									},
									close: function () {
										o.removeClass(n);
									},
								}[e]();
							}
							e.click(function (e) {
								u('open', e);
							}),
								t.click(function (e) {
									e.stopPropagation();
								}),
								n.click(function (e) {
									u('close', e);
								}),
								(0, f.default)('body').keyup(function (e) {
									27 === e.keyCode && u('close');
								});
						});
					var t,
						n =
							'undefined' != typeof window
								? window.$
								: void 0 !== e
								? e.$
								: null,
						f = (t = n) && t.__esModule ? t : { default: t };
					o.exports = i.default;
				}.call(
					this,
					'undefined' != typeof global
						? global
						: 'undefined' != typeof self
						? self
						: 'undefined' != typeof window
						? window
						: {}
				));
			},
			{},
		],
		2: [
			function (i, e, t) {
				(function (e) {
					'use strict';
					var t = o(
							'undefined' != typeof window
								? window.$
								: void 0 !== e
								? e.$
								: null
						),
						n = o(i('./_1_modules/templateList/templateList'));
					function o(e) {
						return e && e.__esModule ? e : { default: e };
					}
					(0, t.default)(function () {
						new n.default();
					});
				}.call(
					this,
					'undefined' != typeof global
						? global
						: 'undefined' != typeof self
						? self
						: 'undefined' != typeof window
						? window
						: {}
				));
			},
			{ './_1_modules/templateList/templateList': 1 },
		],
	},
	{},
	[2]
);
//# sourceMappingURL=prototype-only.js.map
