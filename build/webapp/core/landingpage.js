/*
 * Finfore.net 
 * Landing page. It's the popover that shows when the user first visits the site.
 * Forces the user to choose between a public login or social login.
 *
 */

finfore.landingPage = function() {
	var init = function() {

		//landing page template
		var $landingPageTemplate = $.View('//webapp/views/landingpage.tmpl', {
			user: 'Sebastian Kovacs',
			focus: finfore.data.focus
		});	

		//append template to page
		finfore.$body.append($landingPageTemplate);
		
		//find the dialog element 
		var $landingContainer = $('#landing-page');
		
		var $form = $landingContainer.find('#landing_form');

		//public login method
		var selectPublicAccount = function() {			
			var ids = $form.find('#user_geographic').val() + ',' + $form.find('#user_profession').val() + ',' + $form.find('#user_industry').val();
			
			
			finfore.publicLogin({
				ids: ids
			}, function(response) {

				console.log(response);

				Storage.setItem('landingpage', true);

				window.location.reload();
			});
			
			
			
			return false;
		};
		
		$form.submit(selectPublicAccount);

		//nodes.$publicAccountSelectorForm.submit(selectPublicAccount);

		//show dialog
		setTimeout(function() {
			$.mobile.changePage($landingContainer, {
				transition: 'slidedown'
			});
		}, 1000);

		
	};

	return {
		init: init
	}
}();