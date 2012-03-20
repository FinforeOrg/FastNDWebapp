/*
 * Finfore.net Configs
 * 
 * Loaded separately, not compressed.
 */

var finforeBaseUrl = 'http://api.fastnd.com', // web service url
	finforeAppUrl = 'http://' + window.location.hostname + window.location.pathname; // web app url
	
finforeAppUrl = finforeAppUrl.replace(finforeAppUrl.replace(/^.*[\\\/]/, ''), '');