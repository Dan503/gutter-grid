//This file controls what the default pug markup is for when you use the "gulp new:layout --layoutName" command

export default function (layout) {
	return `
extend ../_1_base/base

block append pre_nav_config
	- var layout = '${layout}';

block append post_nav_config

block layout
`;
}
