//npm imports
import $ from 'jquery';
import { TimelineMax } from "gsap";
import ScrollMagic from "scrollmagic";
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
//import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

import controller from '_config/scrollMagicController';
import onResizeStop from '_functions/onResizeStop';

//Defaults to animating across the full page height
function calcDuration (){
	return $('.JS-pageScrollAnimation__distance').height() - $(window).height();
}

export default function scrollAnimation (animation, sceneParameters = {
		//How long the duration of the scroll animation goes for. It's based on pixels, I recommend using $('.element').height()
		//the duration can also be defined as a percentage (eg. "50%"). The percentage is a percentage of the total screen **WINDOW** height.
	    duration: calcDuration,

		//determines the element that controls when the animations starts
		//triggerElement: $('.JS-element')[0],

		//The default is that it activates when the top of the trigger element hits the center of the screen.
		//"onLeave" triggers when the top of the element hits the top of the screen.
		//"onEnter" triggers when the top of the element hits the botom of the screen.
		//triggerHook: 'onLeave',
}, debug = false){

	var scene = new ScrollMagic.Scene(sceneParameters)
		.setTween(animation)
		//.addIndicators({name: indicatorsName})//to help with debugging
		.addTo(controller);

	if (debug){
		//scene.addIndicators(debug)//to help with debugging
	}

	onResizeStop(()=>{
		scene.refresh();
	});


}

export { controller, calcDuration, scrollAnimation };
