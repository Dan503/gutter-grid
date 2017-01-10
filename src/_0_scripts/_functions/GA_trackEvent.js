//Code for tracking Google Analytics events
export default function GA_trackEvent(category,action,label) {
	//".replace(/(\r\n|\n|\r)/gm,"")" removes any line breaks
	var eventCat = category.replace(/(\r\n|\n|\r)/gm,"").trim();
	var eventAct = action.replace(/(\r\n|\n|\r)/gm,"").trim().toLowerCase();
	var eventLabel = label.replace(/(\r\n|\n|\r)/gm,"").trim();

	try {
		ga('send', 'event', eventCat, eventAct, eventLabel); //Uncomment when Google Analytics has been incorporated into the site
		//console.log("GA event =", {category: eventCat, action: eventAct, label: eventLabel});
	} catch(err){}
}
