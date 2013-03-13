/*
 * Finfore.net
 * Add Company Component
 * 
 */

finfore.analytics = function() {

	var init = function () {
		
		var analytics = !!('_gaq' in window);
		
		
		//Google events analytics setup
		if (analytics) {

			//feed/rss
			$('body').on('click', '.feed .panel-content-wrap ul>li.ui-btn', function(e) {
				
				var $this = $(this);
				
				var category = 'feed';
				var action = 'click';
				
				var label = '';

				//Find Tab name
				var tabId = $this.parents('.tab').attr('id');
				var tabName = '';

				if (tabId == 'main') {

					tabName = 'Main Tab'

				} else {
					$.each(finfore.data.companies, function ( index, value ) {
						if ( value._id == tabId ) {
							tabName = 'Company Tab: ' + value.feed_info.title;
						}
					})
				}
				
				var newsTitle = $this.find('.ui-li-heading').html();
				var columnName = $(this).parents('.panel-content-wrap').prev().find('h1').text();

				label = 'RSS news title: ' + newsTitle;
				label += ', in column: ' + columnName;
				label += ', ' + tabName;

				_gaq.push(['_trackEvent', category, action, label]);
				

			});

			//how often people click on changing public profile
			$('body').on('click', '#public_account', function() {
				var $this = $(this);
				
				var category = 'Public Account';
				var action = 'click'
				var label = 'Combination: ';
				var selects = $('#public-account-box-form').find('select');
				var sLen = selects.length - 1;
				selects.each(function(index){
					label += $(this).find('option:selected').text();
					if (index < sLen) {
						label += ', '
					}
				});

				_gaq.push(['_trackEvent', category, action, label]);
				
			});

			
			$('#login-button').click(function(){
				
				var $this = $(this);
				
				var category = 'Account';
				var action = 'click';
				var label = 'Login';

				_gaq.push(['_trackEvent', category, action, label]);

			});

			// tracking for register
			$('#signup-button').click(function() {
				var $this = $(this);
				
				var category = 'Account';
				var action = 'click';
				var label = 'Sign Up';

				_gaq.push(['_trackEvent', category, action, label]);

			});

			// click on a company tab
			$('body').on('click', '.collapsible-company h3', function() {
				var companyName = $(this).find('.ui-btn-text').html().split('<')[0];
				
				var category = 'Open Company Tab';
				var action = 'click';
				var label = 'Company tab: ' + companyName;
				
				_gaq.push(['_trackEvent', category, action, label]);
				
			});

			// tracking for twitter
			$('body').on('click', 'ul.tweets>li', function() {
				var $this = $(this);
				
				var category = 'Twitter';
				var action = 'click on story'
				var label = '';

				//Find Tab name
				var tabId = $this.parents('.tab').attr('id');
				var tabName = '';

				if (tabId == 'main') {

					tabName = 'Main Tab'

				} else {
					$.each(finfore.data.companies, function ( index, value ) {
						if ( value._id == tabId ) {
							tabName = 'Company Tab: ' + value.feed_info.title;
						}
					})
				}

				var newsTitle = $this.find('.tweet-text').html();
				var columnName = $(this).parents('.panel-content-wrap').prev().find('h1').text();


				label = 'Twitter news title: ' + newsTitle;
				label += ', in column: ' + columnName;
				label += ', ' + tabName;

				_gaq.push(['_trackEvent', category, action, label]);

			});
			
			// tracking for prices
			$('body').on('click', '.prices-table tr', function() {
				var $this = $(this);

				var category = 'Prices';
				var action = 'click';
				var companyName = $($this.find('a')[0]).text();


				//Find Tab name
				var tabId = $this.parents('.tab').attr('id');
				var tabName = '';

				if (tabId == 'main') {

					tabName = 'Main Tab'

				} else {
					$.each(finfore.data.companies, function ( index, value ) {
						if ( value._id == tabId ) {
							tabName = 'Company Tab: ' + value.feed_info.title;
						}
					})
				}

				var label = 'Prices column, click on ' + companyName + ', ' + tabName
				
				_gaq.push(['_trackEvent', category, action, label]);
				
			});

			//tracking for podcast
			$('body').on('click', '.podcast ul.ui-listview>li h3', function() {
				var $this = $(this);
				
				//Find Tab name
				var tabId = $this.parents('.tab').attr('id');
				var tabName = '';

				if (tabId == 'main') {

					tabName = 'Main Tab'

				} else {
					$.each(finfore.data.companies, function ( index, value ) {
						if ( value._id == tabId ) {
							tabName = 'Company Tab: ' + value.feed_info.title;
						}
					})
				}

				var category = 'Podcast';
				var action = 'click';
				var label = 'Podcast column, ' + $this.find('a').html() + ', ' + tabName;

				_gaq.push(['_trackEvent', category, action, label]);

			});
			

			//tracking for scrolling ticker
			$('body').on('click', '.ui-footer a', function() {
				var $this = $(this);
				
				//Find Tab name
				var tabId = $this.parents('.tab').attr('id');
				var tabName = '';

				if (tabId == 'main') {

					tabName = 'Main Tab'

				} else {
					$.each(finfore.data.companies, function ( index, value ) {
						if ( value._id == tabId ) {
							tabName = 'Company Tab: ' + value.feed_info.title;
						}
					})
				}

				var category = 'Scrolling Ticker';
				var action = 'click on story';
				var label = 'Scrolling Ticker news, ' + $this.attr('title') + ', ' + tabName;

				_gaq.push(['_trackEvent', category, action, label]);

			});

			//tracking for search form
			var logger = function () {
				var searchText = $('.tablet-selector-wrapper .ui-listview-filter input.ui-input-text').val();
				var category = 'Search';
				var action = 'type';
				var label = 'Search term: ' + searchText;

				_gaq.push(['_trackEvent', category, action, label]);
				
			}

			var timer;

			$('body').on('keyup', '.tablet-selector-wrapper .ui-listview-filter input.ui-input-text', function (){
				
				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(logger, 1000);
			});

		} //end if _gaq
	};

	return {
		init: init
	}
}();