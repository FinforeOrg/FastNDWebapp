/*
 * Finfore.net 
 * Mobile Desktop Component
 * 
 */

// Define Desktop
finfore.desktop = function() {
	var nodes = {
		$page: [],
		tabs: {
			tabIndex: 0
		},
		$firstColumn: []
	};
	
	var switchedToFirstColumn = false;
	
	// private utility method for main and portfolio dividers
	function capitaliseFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	var tabs = {};
	/*
	 * Add Tab
	 */
	tabs.add = function(options) {
		var isCompany = (options.id !== 'main' && options.id !== 'portfolio'),
			$tab,
			tabMarkup;
		
		if(isCompany) {
			// companies
			tabMarkup = '<li class="company-item"><div data-role="collapsible" data-collapsed="true" data-theme="b" id="' + options.id + '" class="collapsible-company"><h3>' + options.title + '</h3><ul data-role="listview" data-split-icon="arrow-r" data-split-theme="a" class="split-selector"></ul></div></li>';
		} else {
			// main/portfolio
			tabMarkup = '<li data-role="list-divider" id="' + options.id + '">' + capitaliseFirstLetter(options.id) + '</li>';
		};
		
		$tab = $(tabMarkup);
		
		nodes.$mobileMenu.append($tab);
		
		// Enhance controls
		nodes.$menuPage.trigger('create');
		nodes.$mobileMenu.listview();
		
		return $(tabMarkup);
	};
	
	tabs.select = function($tab, $panel) {
		
		setTimeout(function() {
			$('html,body').animate({
				scrollTop: $tab.offset().top
			}, 1000);
		}, 500);
			
		$tab.trigger('expand');
	};
	
	/* 
	 * Panels
	 */	
	var panels = {};
	panels.create = function(data) {
		var $panel = $('<div class="' + data.type + ' panel" data-role="page"></div>'),
			$tab = data.tab,
			$columnContainer = nodes.$mainColumns; // default to main columns container
		
		// add panel dom node to data store
		data.options.$node = $panel;
		$.data($panel[0], 'data', data.options);
		
		// add module type to dom storage
		$.data($panel[0], 'type', data.type);		
		
		var panelTitle;
		if(data.options.feed_account) {
			panelTitle = data.options.feed_account.name;
		};
		
		if(data.options.company) {
			panelTitle = data.options.company.feed_info.title;

			if(data.type === 'feed') {
				panelTitle = 'Company News';
				if(data.options.bingsearch) panelTitle = 'Additional News';
				if(data.options.blogsearch) panelTitle = 'News From Blogs';
			}
			
			if(data.type === 'podcast') panelTitle = 'Podcasts';
			
			if(data.type === 'prices') panelTitle = 'Prices';
			
			if(data.type === 'agenda' && !data.options.competitor) panelTitle = 'Calendar';
			if(data.type === 'agenda' && data.options.competitor) panelTitle = 'Competitors Calendar';
			
			if(data.type === 'twitter' && !data.options.competitor) panelTitle = 'Breaking News';
			if(data.type === 'twitter' && data.options.competitor) panelTitle = 'Competitors News';
			
			if(data.type === 'blinkx') panelTitle = 'Broadcast News';
			
			$tab = $('ul', $tab);
		};
		
		if(data.options.portfolio) {
			panelTitle = '<span class="trunc-title">' + data.options.portfolio.title + '</span>';
			
			if(data.type === 'agenda') panelTitle += ' Calendar';
			if(data.type === 'portfolio') panelTitle += ' Prices';
			if(data.type === 'feed') panelTitle += ' News';			
		}
		
		var $mobilePanelSelector = $('<li><a>' + panelTitle + '</a><a class="mobile-column-select"></a></li>');
		
		$mobilePanelSelector.find('.mobile-column-select').bind('click', function() {			
			$.mobile.changePage($panel, {
				transition: 'slide'
			});
		});
		
		// apend column selector
		
		// refresh listview
		if(data.options.company) {
			$tab.append($mobilePanelSelector);
			$tab.listview('refresh');
		} else {
			$tab.after($mobilePanelSelector);
			nodes.$mobileMenu.listview('refresh');
		}
		
		/* Append Company panels in different containers for each category (main/stocks/companies).
		 * We do this to be able to swipe between columns only from a certain category.
		 */
	
		// change container only if company or portfolio
		if(data.options.company) {
			$columnContainer = nodes.$companiesColumns;
		} else if(data.options.portfolio) {
			$columnContainer = nodes.$stocksColumns;
		};
		
		$panel.appendTo($columnContainer);
		finfore.modules[data.type].init($panel, data.options);
		
		// switch to first column
		if(!switchedToFirstColumn) {
			nodes.$firstColumn = $panel;
			$.mobile.changePage($panel);
			switchedToFirstColumn = true;
		}
	};
	
	/* 
	 * Panel Remove
	 */
	panels.remove = function(data) {
		// Remove DOM node		
		data.options.panel.$node.remove();
	};
	
	/*
	 * Next/Previous Panel Functionality
	 */
	panels.next = function($panel) {		
		var $nextPanel = $panel.nextAll('.panel:first');
		if($nextPanel.length) {
			$.mobile.changePage($nextPanel, {
				transition: 'slide'
			});
		}
	};
	panels.previous = function($panel) {		
		var $nextPanel = $panel.prevAll('.panel:first');
		if($nextPanel.length) {
			$.mobile.changePage($nextPanel, {
				transition: 'slide',
				reverse: true
			});
		}
	};
	
	/* 
	 * News ticker
	 */
	var ticker = {		
		updateNews: function(item) {
			// if a public account is logged-in, return
			if(finfore.data.user.is_public) return false;
			
			var $itemMarkup;
			
			if(item.screen_name) {				
				var url = 'http://twitter.com/' + item.from_user;				
				
				// find links in tweet to use as url
				if(item.text) {
					var urlPattern = /(HTTP:\/\/|HTTPS:\/\/)([a-zA-Z0-9.\/&?_=!*,\(\)+-]+)/i;
					var urlMatch = item.text.match(urlPattern);
					if(urlMatch) url = urlMatch[0];					
				}
				
				// handle twitter
				$itemMarkup = '<a href="' + url + '" target="_blank" title="' + item.text + '" class="twitter-update" data-role="button" data-icon="twitter-update">' + item.text + '</a>';
			} else if (item.elt || item.lt) {
				// prices
				var symbol = item.e + ':' + item.t;
				var priceChange = '';
				var chg = item.cp;
				if(chg < 0) {
					priceChange = '-';
				} else if(chg > 0) {
					priceChange = '+';
				}
				var itemText = symbol + ': ' + item.l + ' ' + priceChange + ' ' + Math.abs(chg) + '%';
				$itemMarkup = '<a href="http://www.google.com/finance?q=' + symbol + '" target="_blank" title="' + item.name + '" data-icon="prices-update" data-role="button">' + itemText + '</a>';
			} else {
				// feed
				var title = item.title || '';
				
				$itemMarkup = '<a href="' + item.link + '" target="_blank" title="' + item.title + '" data-icon="feed-update" data-role="button">' + title + '</a>';
			}			
			
			ticker.$node.append($itemMarkup);			
			$('[data-role=button]:last', ticker.$node).button();			
		}
	};
	ticker.updatePrices = ticker.updateNews;
	
	var init = function() {
		var template = $.View('//webapp/views/desktop.mobile.tmpl', {
				user: finfore.data.user,
				focus: finfore.data.focus,
				focus: finfore.data.focus,
				blankState: finfore.data.blankState,
				selectedFocus: finfore.data.selectedFocus
			});
		
		finfore.$body.append(template);
		
		// main nodes
		$.extend(nodes, {
			$menuPage: $('.menu-page'),
			
			$mainColumns: $('.main-columns'),
			$companiesColumns: $('.companies-columns'),
			$stocksColumns: $('.stocks-columns')
		});
		
		// get sub-nodes, to be able to use contexts
		$.extend(nodes, {
			$alertsBtn: $('.alerts-button', nodes.$menuPage),
			$profileBtn: $('.profile-button', nodes.$menuPage),
			$mobileMenu: $('.mobile-menu', nodes.$menuPage)
		});
		
		// init menu
		nodes.$menuPage.page();
		
		// reder markup
		finfore.$body.trigger('create');
		
		// If the user is logged-in
		if(finfore.data.user) {
			//nodes.$tabBar = $('#mobile-tabs');
				
			// Add Main tab
			var $mainTabBtn = tabs.add({
				id: 'main',
				title: 'Main',
				closable: false
			});
			nodes.tabs.$main = $('#main');
			
			// Add Portfolio tab
			tabs.add({
				id: 'portfolio',
				title: 'Portfolio',
				closable: false
			});
			nodes.tabs.$portfolio = $('#portfolio');
			
			// add tab loaders
			nodes.tabs.$main.add(nodes.tabs.$portfolio);
			
			finfore.populate();
			
			// Panel Next/Previous events
			$(document).delegate('.panel', 'swipeleft', function() {
				panels.next($(this));
			});
			
			$(document).delegate('.panel', 'swiperight', function() {
				panels.previous($(this));
			});
			
			// load column on show
			$(document).delegate('.panel', 'pagebeforeshow', function() {
				var $panel = $(this),
					isLoaded = $panel.hasClass('column-loaded');
					
				if(!isLoaded) {
					$panel.trigger('refresh', [true]);
					$panel.addClass('column-loaded');
				};
			});
		
			// next prev buttons
			$(document).delegate('.panel-next', 'click', function() {
				var $panel = $(this).parents('.panel:first');
				panels.next($panel);
			});
			
			$(document).delegate('.panel-previous', 'click', function() {
				var $panel = $(this).parents('.panel:first');
				panels.previous($panel);
			});			
			
			
			if(finfore.data.user.is_public) {
				// Sign-in button
				$('.signin-button').click(finfore.login.init);
				
			} else {
				// Updates Page
				ticker.$page = $('#mobile-updates');
				ticker.$node = $('.mobile-update-list', ticker.$page);
				
				// header logout
				finfore.$body.delegate('.logout-button', 'click', function() {
					Storage.removeItem('user');
					Storage.removeItem('updateProfile');
					
					window.location.reload();
					return false;
				});
				
			};

			// company lookup
			finfore.$body.delegate('.add-tab-button', 'click', finfore.addcompany.init);
			
			nodes.$alertsBtn.bind('click', function() {
				$.mobile.changePage(ticker.$page);
			});
			
			nodes.$profileBtn.bind('click', function() {
				finfore.profile.init();
				return false;
			});
			
			// press the menu button
			finfore.$body.delegate('.mobile-menu-button', 'click', function(event, ui) {
				finfore.$body.toggleClass('show-menu');
			});
			
			// when changeing page
			finfore.$body.delegate('[data-role]', 'pagebeforeshow', function(event, ui) {
				// remove show-menu class
				finfore.$body.removeClass('show-menu');
			});
			
			/* Hide menu when pressing any .mobile-column-select button from menu-page.
			 * We need this because pageshow/pagebeforeshow doesn't trigger if a page is already visible/changedTo.
			 */
			nodes.$menuPage.delegate('.mobile-column-select', 'click', function(event, ui) {
				finfore.$body.removeClass('show-menu');
			});
			
			/* Hide menu when clicking on the visible content area */
			finfore.$body.delegate('.mobile-content-overlay', 'click', function(event, ui) {
				finfore.$body.removeClass('show-menu');
			});
		
		};
		
	};

	return {
		init: init,
		nodes: nodes,
		tabs: tabs,
		panels: panels,
		ticker: ticker
	}
}();