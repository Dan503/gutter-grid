export default function generateFolderName(pageTitle){
	//convert to lowercase
	//then remove all quote characters, both single and double
	//then replace all characters that are not a letter or a number with a "-" dash
	//then in areas that have multiple dashes next to one another, replace them with a single dash
	return pageTitle.toLowerCase().replace(/['|"]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, '-');
}
