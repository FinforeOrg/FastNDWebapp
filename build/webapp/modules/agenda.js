/*
 * FinFore.net 
 * Feed Module
 *
 */
 
// Define module
finfore.modules.agenda = function() {
	
	var init = function($container, options) {
		current_user_id = finfore.data.user.id;
		var exists = false;
		
		var feedNumber;
		
		var loadData = function() {
			$container.addClass('panel-loading');
			
			var markup = '';
			var ticker_data = '';			
			
			if(options.company) {
				if(options.competitor) {
					ticker_data = options.company.feed_info.company_competitor.competitor_ticker;
				} else {
					ticker_data = options.company.feed_info.company_competitor.company_ticker;					
				}
			} else {
				
				if($.isArray(options.portfolio.overview.rss.chanel.item)) {
					$.each(options.portfolio.overview.rss.chanel.item, function(i) {
						if(this.google_ticker) {
							ticker_data += this.google_ticker + ',';
						}
					});
				} else {
					
					// data validation in case channel is returned empty from api
					if(options.portfolio.overview.rss.chanel.item) {
						ticker_data = options.portfolio.overview.rss.chanel.item.google_ticker;
					};
					
				}
				
			};			
			
			/* If ticker_data is still empty, there was an error with the web service,
			 * so we won't go any further.
			 */
			if(!ticker_data) return false;
			
			// remove all spaces (if they exist, because of web service error) from tickers			
			ticker_data = ticker_data.replace(/\s/g, '');
			
			$.ajax({
				url: finforeAppUrl + 'ffproxy.php?url=' + $.URLEncode('http://www.google.com/finance/events?output=json&q=' + ticker_data),
				dataType: 'text',
				success: function(result){
					
					var currentMonth = '';
					var markup = '';
					
					var calendar = [];
					if(result) calendar = eval(result);
					
					var today = new Date(),
						itemDate;

					if($.isArray(calendar) && calendar.length) {
						calendar = calendar.reverse();
					
						$.each(calendar, function() {
							// get calendar date
							itemDate = new Date(this.LocalizedInfo.start_date);
							// reset hour
							itemDate.setHours(0);
							
							
							if(itemDate >= today) {
								var date = this.LocalizedInfo.start_date;
								var event_name = this.desc;
								
								var myregexp = /^[A-Za-z]{3}/;
								var match = myregexp.exec(date);
								if (match != null) {
									result = match[0];
								}
								
								var myregexp_year = /[0-9]{4}$/;
								var match_year = myregexp_year.exec(date);
								if (match_year != null) {
									result_year = match_year[0];
								}
								
								if(currentMonth != result) {											
									if(currentMonth == '') {
										currentMonth = result;							
										markup += '<div class="events-month"><table class="events-table"><thead><tr class="ui-bar-a"><td colspan="2">' + currentMonth + ' ' + result_year + '</td></tr></thead><tbody>';
									} else {
										currentMonth = result;
										markup += '</tbody></table></div><div class="events-month"><table class="events-table"><thead><tr class="ui-bar-a"><td colspan="2">' + currentMonth + ' ' + result_year + '</td></tr></thead><tbody>';	
									}
								}
								
								markup += '<tr class="ui-btn-up-c">';
								markup += '<td>' + date + ', ';
								if(this.LocalizedInfo.start_time) {
									markup += this.LocalizedInfo.start_time;
								} else {
									markup += 'All Day';
								}
								markup += '</td><td>' + event_name + '</td>';						
								markup += '</tr>';
							};
						});
					}
					
					if(!markup) {
						markup = '<table class="events-table"><thead><tr><td class="ui-bar-d">No upcoming events </td></tr></thead></table>';
					};
					
					$(markup).appendTo($('.events-months-container', $container));					
					$container.removeClass('panel-loading');
				},
				complete: function() {
					$container.removeClass('panel-loading');
				}
			});			
			
		}
	
		var refresh = function(event, params) {
			empty($('[data-role=content] .events-months-container', $container)[0]);
			loadData();
		};
		
		var build = function() {	
			var contentHeight = $(document).height() - 220;			
			if(options.company) {
				var title = "Calendar";
				if(options.competitor) title = "Competitors Calendar";
			} else {
				if(options.portfolio) {
					var title = options.portfolio.title
				} else {
					var title = options.feed_account.name;
				};
			}
			
			var moduleContent = $.View('//webapp/views/module.agenda.tmpl', {});
			var template = $.View('//webapp/views/module.tmpl', {
				title: title,
				smallScreen: finfore.smallScreen,
				content: moduleContent
			});
			$(template).appendTo($container);
			
			if(!finfore.smallScreen) {
				var autorefresh = setInterval(refresh, 300000);
				loadData();
			};
			
			// render markup
			$container.page();

			// bind panel events
			$container.bind('refresh', refresh);
		
			$container.trigger('init');	
		};
		
		build();
	};
	
	return {
		init: init		
	}
}();