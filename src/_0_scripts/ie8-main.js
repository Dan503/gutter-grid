$(document).ready(function(){

//alternative pubSub script
//https://davidwalsh.name/pubsub-javascript
var events = (function(){
	var topics = {};
	var hOP = topics.hasOwnProperty;

	return {
		subscribe: function(topic, listener) {
			// Create the topic's object if not yet created
			if(!hOP.call(topics, topic)) topics[topic] = [];

		},
		publish: function(topic, info) {
			// If the topic doesn't exist, or there's no listeners in queue, just leave
			if(!hOP.call(topics, topic)) return;

			//fire!
			return topics[topic](info !== undefined ? info : {});
		}
	};
})();



//IE8 tabs code
	var //hooks
	_module = $('.JS-tabs'),
	_content = $('.JS-tabs__content'),
	_triggers = $('.JS-tabs__trigger');

	var //classes
	active_ = '-active';

	//module functionality

	function tabs(elem) {

		var This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$triggers = this.$elem.find('.JS-tabs__trigger');
		this.$content = this.$elem.find('.JS-tabs__content');
		this.is_defaultSwitcher = this.$elem.is('#JS-tabs__defaultSelector');

		this.$triggers.click(function (e) {
			e.preventDefault();
			switchTab($(this));
		});

		if (typeof window.localStorage.activeTab !== 'undefined') {
			switchTab(window.localStorage.activeTab);
		} else {
			switchTab(0);
		}

		if (!this.is_defaultSwitcher) {
			events.subscribe('defaultSwitch', function (index) {
				switchTab(index);
			});
		}

		function switchTab(tab) {

			if ($.isNumeric(tab)) {
				tab = This.$triggers.eq(tab);
			}

			var pos = tab.parent().index();

			console.log(This.$triggers.filter('.' + active_).length);

			This.$triggers.filter('.' + active_).removeClass(active_);
			tab.addClass(active_);

			This.$content.hide();
			This.$content.eq(pos).show();

			if (This.is_defaultSwitcher) {
				window.localStorage.activeTab = pos;
				events.publish('defaultSwitch', pos);
			}
		}
	}

	_module.each(function(e){
		var tabset = new tabs(this);
	})

});