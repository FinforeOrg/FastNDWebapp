/*
 * FinFore.net 
 * Blinkx Module
 *
 */
 
// Define module
finfore.modules.blinkx = function() {
	
	var videoExt = ['mp4', '3g2', '3gp', 'asf', 'asx', 'avi', 'flv', 'mov', 'mpg', 'rm', 'vob', 'webm', 'wmv', 'ogv', 'mp4', 'ogg'];
	
	// grab data
	var getBlinkxData = function(options) {
		
		options.company.feed_info.company_competitor.broadcast_keyword = options.company.feed_info.company_competitor.broadcast_keyword.replace(/ /g, '+');
		
		// blinkx api url
		var apiUrl = 'http://usp1.blinkx.com/partnerapi/user/?uid=2ehiek5947&text="' + options.company.feed_info.company_competitor.broadcast_keyword + '"&start=' + options.start + '&MaxResults=' + options.end + '&sortby=date&AdultFilter=true&ReturnLink=true';		
		apiUrl = finforeAppUrl + 'ffproxy.php?url=' + $.URLEncode(apiUrl);
		
		
		$.ajax({
			url: apiUrl,			
			type: 'GET',
			dataType: 'xml',
			success: function(response) {
				var $hits = $('responsedata hit', response);
				
				// parse entries
				var markup = '';
				var entriesLength = $hits.length - 1;
				
				var $this,
					date,
					extension,
					title,
					source,
					summary,
					image,
					url,
					pubDate;
				
				$.each($hits, function(index, value) {
					$this = $(this);
					
					date = $('date', $this).text();
					extension = $('media_format_string', $this).text();
					title = $('title', $this).text();
					source = $('channel', $this).text();
					summary = $('summary', $this).text();					
					image = $('staticpreview', $this).text();					
					url = $('url', $this).text();					
					
					// check date
					pubDate = new Date(date * 1000);					
					
					if(finfore.smallScreen || finfore.tablet) {
						url = url.replace('http://www.blinkx.com/burl?v=', 'http://m.blinkx.com/info/');
					};
					
					if((options.loadMore === true) || (pubDate > options.date)) {
						if(index === entriesLength) {
							markup += '<li class="last-in-group" data-icon="false">';
						} else {
							markup += '<li data-icon="false">';				
						};
						
						markup += '<a href="' + url + '" target="_blank"><abbr>' + source + '</abbr>';
						markup += '<h3>' + title + '</h3>';
						
						markup += '<img src="' + image + '" />';
						
						markup += '<p>' + summary.substring(0, 100) + '..' + '</p>';
						markup += '<abbr>' + pubDate.toUTCString() + '</abbr>';
						markup += '</a></li>';
					}
				});
				
				var $loadMoreLi = $('.load-more-entries', options.$container).parents('li').first();
				var $markup = $(markup);
				$markup.insertBefore($loadMoreLi);
				
				var $listview = $('[data-role=content] ul', options.$container);
				$listview.listview('refresh');
				
			},
			complete: function() {
				options.$container.removeClass('panel-loading');				
			}
		});		
	};
	
	var init = function($container, options) {
		var start = 0,
			end = 0,
			multiplier = 20;
		
		var refresh = function(e, loadmore) {
			$container.addClass('panel-loading');			
			
			if(loadmore === true) {
				start = end + 1;
				end += multiplier;
				
				getBlinkxData({
					start: start,
					end: end,
					date: new Date(),
					loadMore: loadmore,
					company: options.company,
					$container: $container
				});			
			
			} else {
				
				getBlinkxData({
					start: 1,
					end: end,
					date: new Date(),
					loadMore: loadmore,
					company: options.company,
					$container: $container
				});
				
			};			
			
			
		};		
		
		var build = function() {
			var contentHeight = $(document).height() - 220;			
			
			var moduleContent = $.View('//webapp/views/module.blinkx.tmpl', {});
			var template = $.View('//webapp/views/module.tmpl', {
				title: 'Broadcast News',
				smallScreen: finfore.smallScreen,
				content: moduleContent
			});			
			$(template).appendTo($container);
			
			var $loadMoreEntriesBtn = $('.load-more-entries', $container);				
			$loadMoreEntriesBtn.click(function(e) {				
				$container.trigger('refresh', [true]);
				
				e.preventDefault();
				return false;					
			});
			
			// bind panel events
			$container.bind('refresh', refresh);
			$container.bind('reinit', function() {
				// clear refresh interval
				clearInterval(autorefresh);
				// cleanup dom
				$container.unbind();
				$container.empty();
				$container.jqmRemoveData();
				
				// reinit
				init($container, options);
			});
			
			if(!finfore.smallScreen) {
				var autorefresh = setInterval(refresh, 300000);
				$container.trigger('refresh', [true]);
			};
			
			// render markup
			$container.page();
			
			$container.trigger('init');			
		}();		
	
	};
	
	return {
		init: init
	}
}();