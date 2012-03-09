# FastND (previously Finfore.net)
*Web Service/API Documentation*

The FastND web service acts as an API for other applications (web based, Air, or native blackberry/android/ios mobile apps, for now). 

## How it works

The web service provides a REST interface for the external apps to get/add/delete/modify data stored in the database. It also provides methods for authenticating various third party services through OAuth, such as Google, Facebook, Twitter or LinkedIn.

## Technical Details

The API is built using Ruby on Rails 3 and MongoDB. 

### Formats
The API supports JSON and XML as response formats. Each request takes the format as a parameter, by specifying the extension at the each of each method/URL from the API.

For example:

* `/category_focus.json` for the JSON format, or
* `/category_focus.xml` for the XML format

### Cross-Domain Requests
In order to be able to use the API from other domains, we're using the [CORS](https://developer.mozilla.org/En/HTTP_access_control) standard. Each method from the API also sends the custom headers (such as `Access-Control-Allow-Origin: *`) required, so that the requests can be made from different domains.



## Workflow

### Focus areas

Each account has a number (unlimited) of focus/interest areas selected, from three categories: Profession, Industry and Geography.
This is, most often, the first request an application has to make, so that it has the data needed for the following actions.

In other to get the complete list/array of focus/interest areas, an application has to make the following request:

`GET /category_focus`

The API will respond with an array of focus/interest areas, as objects, each with it's own `_id` and other properties.

### Register

A user can create an account by providing certain details such as an email address, name, password, and interest/focus areas.

The API creates a user account using:

`POST /users`

with the required parameters.

### Sign-in

There are three types of singing-in processes.

#### Regular Account Sign-in

To authenticate a regular account use:

`POST /user_sessions`

with the `login` and `password` parameters, representing the user's email address and their password. These have to be wrapped in the `user_session` object.

The method will respond with the contents of the `User` object. We'll use the contents of this response for most of the other requests.

The `User` object also contains the `single_access_token` and `persistence_token`. These tokens need to be provided as parameters for all requests, from this point onward, for security reasons.

#### Public Account Sign-in

FastND provides a number of *test accounts*, to which we refer to as *Public Accounts*. These are real accounts, the only difference to a regular account being that they have an extra `is_public` property in the `User` object, set to `true`.

These accounts can be logged into by with a different a method, using focus areas as the parameters for it, instead of the email/password combination, as with the regular Sign-in method.

`POST /user_sessions/public_login`, with the `_id`s of the selected focus areas.

#### Sign-in with Social Account

Users can also sign-in with their existing Google, Facebook, Twitter of LinkedIn accounts, and the API will automatically create an account in the FastND database.

An app has to open the following URL:

`/auth/[social-network]?callback=[callback_url]`

The `social-network` parameter can be:

* google
* facebook
* twitter
* linkedin

The `callback-url` parameter has to be an URL, from the app, to which the API will redirect after going through the authorization process of the social network.

The API will return the `User` object as a GET parameter in the callback URL.

### Columns

FastND uses the concept of *column*, as the main way of representing data.
Columns can be of several types (RSS, Twitter, LinkedIn, Google Calendar, etc.) and aggregate different types of data from different sources. 

An app can get the full list of columns from a users account, from the `User` object, returned from the sign-in process.
The list/array of columns is included in the `feed_accounts` object. 

Each of these columns have a number of properties associated with them, such as a list of URLs for RSS feeds, from which to aggregate data in the specific column, for example.


### Tabs

Another concept heavily used in FastND is *tabs*.

All columns, except for the ones with the `portfolio` type, from the `feed_accounts` object, in the `User` object, are placed in a *Main* tab.


### Portfolios

If there are any `feed_accounts` with the `portfolio` type, these represent Google Finance accounts associated with the user's account, and contain details needed in order to get the list of portfolios from the Google account.

To get the list of portfolios, for a `feed_account`:

`GET /portfolios/list` with the `_id` property from the current `feed_account` account as a parameter.

This will return the list/array of portfolios associated with the current Google account, each with it's specific properties.

The app will use this data, to create three columns for each portfolio.

### Companies

Another important concept in FastND is the concept of *company*. Each company has it's separate tab in the app.

The list of companies from a user's account can be got from the `user_company_tabs` object, in the `User` object. 
This contains an array of all associated companies, with their specific properties.

The app will create a number of columns inside a company tab, using data from `user_company_tabs`.

### Management

Each of these objects can be modified and/or deleted using the REST interface:

* Details from the `User` account, such as a user's email address, can be changed
* Columns can be edited/deleted
* Companies can be added/deleted

- - -

This is just a rough description of the capabilities and workflow of the API.
Please feel free to request more specific details or clarifications.