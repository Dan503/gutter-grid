
//This file controls what goes into the moduleName.pug files that are generated from using the "gulp new:module --moduleName" command

export default function(moduleName){
	return `
mixin ${moduleName}(spec)
	-
		spec = defaultTo(spec, {
			classes : '',
		});

	.${moduleName}(class=spec.classes)&attributes(attributes)
		if block
			block
		else
			p This is an example paragraph for the ${moduleName} module
`;
}