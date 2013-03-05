/*
 * Finfore.net
 * Add Company Component
 * 
 */

finfore.analytics = function() {

	var init = function () {

		//Google events analytics setup
		if (_gaq) {
			

			//feed/rss
			$('body').on('click', '.panel-content-wrap ul>li.ui-btn', function(e) {
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

			// tracking for login
			$('body').on('click', '#login-button', function() {
				var $this = $(this);
				
				var category = 'Account';
				var action = 'click';
				var label = 'Login';

				_gaq.push(['_trackEvent', category, action, label]);

			});

			// tracking for register
			$('body').on('click', '#signup-button', function() {
				var $this = $(this);
				
				var category = 'Account';
				var action = 'click';
				var label = 'Sign Up';

				_gaq.push(['_trackEvent', category, action, label]);

			});

			// Search for company

			// Open company tab (tablet-selector-wrapper)
			$('body').on('click', '.tablet-tab-list li a', function() {
				var $this = $(this);
				
				var category = $this.parents('.collapsible-company').find('h3').find('span.ui-btn-text').text();
				var action = 'click';
				var label = $this.html();

				_gaq.push(['_trackEvent', category, action, label]);

			});


			// tracking for twitter
			$('body').on('click', 'ul.tweets>li', function() {
				var $this = $(this);
				
				var category = 'Twitter';
				var action = 'click on story'
				var label = $this.find('.tweet-text').html();

				_gaq.push(['_trackEvent', category, action, label]);
			});

			//tracking for podcast
			$('body').on('click', '.podcast ul.ui-listview>li h3', function() {
				var $this = $(this);
				
				var category = 'podcast';
				var action = 'click on story';
				var label = $this.find('a').html();

				_gaq.push(['_trackEvent', category, action, label]);
			});

			//tracking for prices
			$('body').on('click', '.prices-table tr', function() {
				var $this = $(this);
				
				var category = 'podcast';
				var action = 'click on story';
				var label = $($this.find('a')[0]).attr('href');

				_gaq.push(['_trackEvent', category, action, label]);

			});

			//tracking for scrolling ticker
			$('body').on('click', '.ui-footer a', function() {
				var $this = $(this);
				
				var category = 'ticker';
				var action = 'click on story';
				var label = $this.attr('title');

				_gaq.push(['_trackEvent', category, action, label]);

			});

						
			

		} //end if _gaq
	};

	return {
		init: init,
	}
}();