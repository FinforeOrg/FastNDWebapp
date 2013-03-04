/*
 * FinFore.net 
 * Feed Module
 *
 */

var addthis_config = {
	pubid: 'ra-50cf034a5562d612'
    ,ui_cobrand: "Fastnd.com"
    ,ui_click: true
    ,services_compact: 'facebook,twitter,linkedin'
    ,services_exclude: 'email,gmail,yahoomail,hotmail'
}

// Define module
finfore.modules.feed = function() {
	var multiplier = 15;

	
	// Feed Module Management
	var management = function($container) {
		var category = 'feed';	
		if(!finfore.data.panels.main[category]) finfore.data.panels.main[category] = [];
		
		// get and render Podcast Managemenet template
		var template = $.View('//webapp/views/module.feed.management.tmpl', {		
			panels: finfore.data.panels.main.feed
		});
		
		$(template).appendTo($container);
		
		// panel management
		var $panelContainer = $('.mtabs-container', $container);		
		
		finfore.manage.bindPanelData({
			$container: $panelContainer,
			category: category
			});
		
		$($container).on('click', '.edit-column-title', function() {
			finfore.manage.panels.edit({
				$node: $(this).parents('.mtab-selector').prev(),
				category: category
			});			
		});
		
		$('.add-column', $container).click(function() {			
			finfore.manage.panels.create({
				$node: $panelContainer,
				category: category
			});			
		});
		
		$($container).on('click', '.remove-column' ,function() {	
			
			finfore.manage.panels.remove({
				$node: $(this).parents('.mtab-selector').prev(),
				category: category
			});			
		});
		
		// sources events		
		$panelContainer.delegate('.add-custom-source', 'click', function() {
			finfore.manage.sources.addCustom({
				$node: $('.mtab:checked', $panelContainer),
				category: category
			});
		});
		
		$panelContainer.delegate('.remove-source', 'click', function() {
			$(this).parent().prev().attr('checked', 'checked');
			finfore.manage.sources.remove({
				//$node: $('.mtab:checked', $panelContainer),
				$node: $(this).parents('.mtab-content').prev().prev(),
				category: category
			});
		});
		
		// preset sources
		$container.on('click', '.add-preset-source' , function(e) {
			e.preventDefault();
			$(this).parent().prev().attr('checked','checked');

			finfore.manage.sources.addPreset({
				$node: $('.mtab:checked', $panelContainer),
				$presets: $('.preset-tabs', $container),
				category: category
			});			
		});		
		
		// make sources content droppable
		$('.mtab-content', $panelContainer).droppable({
			activeClass: "ui-state-highlight",
			drop: function(e, ui) {
				finfore.manage.sources.addPreset({
					$node: $('.mtab:checked', $panelContainer),
					$presets: $('.preset-tabs', $container),
					category: category
				});	
			}
		});		
		
		
		// init feed_infos
		var suggestedCount = allCount = 0;
		var $presetSuggested = $('.preset-sources-suggested', $container),
			$presetAll = $('.preset-sources-all', $container);
	
		var loadMoreSuggested = function() {
			suggestedCount++;
			finfore.manage.updateFeedInfos({
				$node: $presetSuggested,
				type: category,
				category: 'rss',
				count: suggestedCount
			});
			return false;
		};
		
		var loadMoreAll = function() {
			allCount++;
			finfore.manage.updateFeedInfos({
				$node: $presetAll,
				type: category,
				category: 'all,rss',
				count: allCount
			});
			return false;
		};
		
		// load more suggested feeds
		loadMoreSuggested();
		loadMoreAll();

	};

	// grab feed data
	var getFeedData = function(options) {
		
		// copy the array so that we can modify the urls, without affecting the original
		var sources = options.sources.slice(0);
		
		// detect if Bing API, to add count offset to url
		if(options.bingsearch && options.limit > multiplier) {
			sources[0] += '&news.offset=';
			sources[0] += (options.limit * 1) - 14;
		}
		


		feedReader.get({
			callbackId: options.callbackId,
			sources: sources,
			limit: options.limit,
			
			bingsearch: options.bingsearch,
			blogsearch: options.blogsearch,
			company: options.company,
			
			complete: function(entries) {
				
				// if loading more entries, slice the array to only show the latest 10
				if(!options.bingsearch && ((options.loadMore === true) && (options.limit > multiplier))) {
					entries = entries.slice(options.limit - multiplier, options.limit);
				};
				
				// parse entries
				var markup = '',
					entriesLength = entries.length - 1,
					addthisToolboxProperties = [];



				$.each(entries, function(index) {
					
					//check if link is string or object
					if (typeof this.link == 'object'){
						this.link = this.link.href;
					}

					// check date
					if((options.loadMore === true) || (this.pubDate > options.date)) {
						if(index === entriesLength) {
							markup += '<li class="last-in-group" data-i	="false">';
						} else {
							markup += '<li data-icon="false">';
						};
						
						if(finfore.smallScreen) {
							markup += '<a><abbr>' + this.source + '</abbr>';

							markup += '<h3>' + this.title + '</h3>';
							markup += '<abbr>' + this.pubDate.toUTCString() + '</abbr>';
							markup += '</a><a href="' + this.link + '" target="_blank" class="mobile-column-select"></a>';
						} else {
							markup += '<a title="'+this.title+'" href="' + this.link + '" target="_blank"><abbr>' + this.source + '</abbr>';
							markup += '<h3>' + this.title + '</h3>';
							markup += '<p class="feed-item-description">' + this.description + '</p>';
							markup += '<abbr>' + this.pubDate.toUTCString() + '</abbr>';
							markup += '</a>';							
						}

						markup += '</li>';
						
						
						
						if(!options.company || !finfore.smallScreen) {
							if(this.pubDate > finfore.ticker.date) {
								finfore.ticker.updateNews(this);
							};
						};
					}

					var props = {
						link: this.link,
						title: this.title,
						description: this.description
					}

					addthisToolboxProperties.push(props);
					
				});

				var $loadMoreLi = $('.load-more-entries', options.$container).parents('li').first();
				$(markup).insertBefore($loadMoreLi);
				
				var $content = $('[data-role=content] ul', options.$container);

				if($content.jqmData('listview')) {
					$content.listview('refresh');
				} else {
					$content.listview();
				}

				// append and init addthis
				var $this;
				var addthisToolboxMarkup = '<div class="sharing">';
				addthisToolboxMarkup += '<a class="at_compact" ></a>';
				addthisToolboxMarkup += '<div class="toolbox">';
				addthisToolboxMarkup += '<a class="addthis_button_email" ></a>';
				addthisToolboxMarkup += '</div>';
				addthisToolboxMarkup += '</div>';

				addthisToolboxProperties.reverse();

				var $elements;
				if (finfore.smallScreen) {
					$elements = $content.find('h3.ui-li-heading');
				} else {
					$elements = $content.find('.feed-item-description');
				}


				$( $elements.get().reverse() ).each(function(index) {
					//stop when list of new loaded items is finished
					if(index === entries.length) {
						return false;
					}

					$this = $(this);

					//append .toolbox markup
					$this.after(addthisToolboxMarkup);

					//create settings objects
					var confObj = {
		                ui_email_note: addthisToolboxProperties[index].description
		                ,ui_click: true
		            };

		            var confObjButton = {
		            	services_compact: 'facebook,twitter,linkedin',
		            	services_exclude: 'email,gmail,yahoomail,hotmail'
		            }

		            var shareObj = {
		                url: addthisToolboxProperties[index].link,
		                title: addthisToolboxProperties[index].title + ' (via fastnd.com)',
		                description: addthisToolboxProperties[index].description,
		                passthrough: {
		                    twitter: {
		                        via: 'fastnd',
		                        text: addthisToolboxProperties[index].title
		                    }
		                }
		                
		            };
					
					addthis.toolbox( $this.next('div').find('.toolbox')[0], confObj, shareObj );
					addthis.button( $this.next('div').find('.at_compact')[0], confObjButton, shareObj );

					//fix for the addthis popup position rendering issue
					var st;
					function onOver () {
						if (st) {
							window.clearTimeout(st);
						}
						
						var $this = $(this);
						var offset = $this.offset();
						var oleft = offset.left;
						var otop = offset.top;
						
						st = setTimeout(function () {
							var $popUp = $('#at15s');
							var limit = $('body').width() - $popUp.width();
							
							if (oleft > limit){
								oleft = limit
							}

							$popUp.css({
								top: otop + 'px',
								left: oleft + 'px'
							});
						}, 100);
					}

					

					$this.next('div').find('.at_compact').click(onOver);					
					$this.next('div').find('.addthis_button_email').click(function () {
						var note = $(this).parents('.ui-btn-text').find('.feed-item-description').text();
						setTimeout(function(){
							$('textarea#at_msg').val('');
							$('textarea#at_msg').val(note + ' | via <a href="http://fastnd.com">fastnd.com</a>');
						}, 100)
					});

				});
				
				//remove the arrow from last item
				$content.find('span.ui-icon-arrow-r').remove();

				//hide loading gif
				options.$container.removeClass('panel-loading');

				
			}
		});


	}; //end getFeedData
	
	var init = function($container, options) {
		var feedNumber = 0,
			sources = [];
		
		// Company News
		if(options.company) {
			
			var sourceUrl;
			if(options.blogsearch) {
				sourceUrl = 'http://api.fastnd.com/finance/blog?hl=en&q=' + $.URLEncode(options.company.feed_info.company_competitor.blog_keyword) + '&ie=utf-8&tbm=blg&num=100&output=rss';
			} else if(options.bingsearch) {
				// replace the ',' character in the string with ' OR ', to be compatible with Bing Search API
				options.company.feed_info.company_competitor.bing_keyword = options.company.feed_info.company_competitor.bing_keyword.replace(',', ' OR ');
				
				sourceUrl = 'http://api.bing.com/rss.aspx?Source=News&Market=en-US&Version=2.0&Query=' + $.URLEncode(options.company.feed_info.company_competitor.bing_keyword) + '&news.count=' + multiplier;
			} else {
				
				sourceUrl = 'http://www.google.com/finance/company_news?q=' + options.company.feed_info.company_competitor.finance_keyword + '&authuser=0&output=rss&num=100';
			}
			
			sources = [sourceUrl];			
		}
		
		// Portfolio News
		if(options.portfolio && options.portfolio.overview.rss.chanel.item) {
			if($.isArray(options.portfolio.overview.rss.chanel.item)) {
				$.each(options.portfolio.overview.rss.chanel.item, function() {
					sources.push('http://www.google.com/finance/company_news?q=' + this.google_ticker + '&authuser=0&output=rss');
				});
			} else {
				sources = ['http://www.google.com/finance/company_news?q=' + options.portfolio.overview.rss.chanel.item.google_ticker + '&authuser=0&output=rss'];
			}
		};
		
		// Main
		if(options.feed_account && !options.portfolio) {
			sources = $.map(options.feed_account.user_feeds, function(n) {
				return n.feed_info.address;
			});
		};
		
		var refresh = function(e, loadmore) {
			$container.addClass('panel-loading');
			
			if(loadmore === true) {
				feedNumber += multiplier;
			};
			

			var callbackId;
			if(options.feed_account) {
				callbackId = options.feed_account._id;
			} else if(options.company) {
				// prevent multiple feed columns in the same company
				// from having the same callback
				callbackId = options.company._id;
				if(options.blogsearch) callbackId += 'blogsearch';
				if(options.bingsearch) callbackId += 'bingsearch';
			}
			
			getFeedData({
				sources: sources,
				$container: $container,
				date: new Date(),
				loadMore: loadmore,
				limit: feedNumber,
				blogsearch: options.blogsearch,
				bingsearch: options.bingsearch,
				company: options.company,
				callbackId: callbackId
			});
		
		};		
		
		var build = function() {		
			var contentHeight = $(document).height() - 220;
			if(options.feed_account) {
				var title = options.feed_account.name;
			}
			if(options.portfolio) {
				title = options.portfolio.title
			};
			if(options.company) {
				var title = 'Company News';
				if(options.blogsearch) {
					title = 'Ideas & Opinions';
				}
				if(options.bingsearch) {
					title = 'Additional News';
				}
			}
			
			var moduleContent = $.View('//webapp/views/module.feed.tmpl', {
				smallScreen: finfore.smallScreen
			});
			
			var template = $.View('//webapp/views/module.tmpl', {
				title: title,
				smallScreen: finfore.smallScreen,
				content: moduleContent
			});
			$(template).appendTo($container);
			
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
			
			var $loadMoreEntriesBtn = $('.load-more-entries', $container);				
			$loadMoreEntriesBtn.click(function(e) {	

				$container.trigger('refresh', true);
				
				e.preventDefault();
				return false;
			});
			
			if(!finfore.smallScreen) {
				var autorefresh = setInterval(refresh, 300000);
			};
			
			// render markup
			$container.page();
			
			// trigger init event
			$container.trigger('init');

		}();
		
	
	};
	
	return {
		init: init,
		management: management
	}
}();