# jarvus-googlepicker
An Ext JS package wrapper for the Google Picker

## Set Up

### Create API Key (Developer Key)
in the Google Developers Console:

1. Open the Credentials page.
2. Create your application's API key by clicking Add credentials > API key.
3. Look for your API key in the API keys section.

### Create OAuth 2.0 credentials (Client Id)
in the Google Developers Console:

1. Open the Credentials page.
2. Create your OAuth 2.0 credentials by clicking Add credentials > OAuth 2.0 client ID.
3. Look for your OAuth 2.0 client ID key in the OAuth 2.0 client IDs section.


## Usage
    Ext.create('Jarvus.form.GooglePicker', {

        // The API Key created above
        developerKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

        // The OAuth 2.0 client ID created above
        clientId: '123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',

        /*
         * If configured, an array of scope codes needed to obtain the OAuth 2.0 token
         * see: https://developers.google.com/picker/docs/#otherviews
         */
        authorizationScope: ['https://www.googleapis.com/auth/drive'],

        /*
         * If true, login uses "immediate mode", which means that the token is refreshed
         * behind the scenes, and no UI is shown to the user
         * defaults to false
         */
        authorizationImmediate: true,

        /*
         * An array of viewIds
         * see: https://developers.google.com/picker/docs/#otherviews
         */
        views: ['DOCS','FOLDERS','PDFS']

    });
