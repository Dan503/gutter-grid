//This file controls what goes into the moduleName.scss files that are generated from using the "gulp new:module --moduleName" command

export default function (moduleName) {
	return `
.${moduleName} {
	&__element {}
}
`;
}
