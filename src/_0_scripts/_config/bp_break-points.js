///*================================================*\
//	BREAK POINTS
//----------------------------------------------------
//	Defines the points at which the page design
//	will snap and drastically change it's styles
//
//  Best used in conjunction with the media query functions
//  if (max(bp['mobile'])){ ... }
//  if (max('mobile'){ ... } also works as a short cut
//
//	!!!WARNING!!!
//	Ensure that these are always in synch with
//	the SASS break points:
//	/SITE-site-name/_src/_styles/00-config-files/03-BPs-MQs-SASS/00-bp-break-points-base.scss
//*================================================*/

export default {
	minimum: 300, //*The smallest width that the site is able to shrink to */
	tiny: 350, //*essentially iphones in portrait view only*/
	small: 480,
	mobile: 600, ///*!MAJOR BREAK POINT!*//*Maximum for strict mobile view*/
	mid: 770, //*essentially the maximum for iPads in portrait*/
	tablet: 960, ///*!MAJOR BREAK POINT!*/ /*good place to switch to tablet view*/
	large: 1024, //*maximum for iPads in landscape*/
	page: 1200, ///*!MAJOR BREAK POINT!*//*Point at which the edge of the desktop design meets the edge of the screen*/
};
