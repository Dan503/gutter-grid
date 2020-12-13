// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

//npm plugins
import $ from 'jquery';

//shared scripts
import templateList from './_1_modules/templateList/templateList';

$(() => {
	new templateList();
});
