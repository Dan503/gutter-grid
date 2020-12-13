//This file controls what the default pug markup is for when you use the "gulp new:template --templateName" command

export default function (templateName, layout = 'standard') {
	return `
extend /_2_layouts/${layout}

block append pre_nav_config

block append post_nav_config

`;
}
