/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('Jarvus.form.GooglePicker', {
    extend: 'Ext.Component',
    xtype: 'jarvus-form-googlepicker',

    requires: [
        'Jarvus.util.GooglePickerApi'
    ],

    config: {
        developerKey: null,
        clientId: null,
        appId: null,
        oauthToken: null,
        authorizationScope: null,
        authorizationImmediate: false,
        picker: null
    },

    initialize: function() {
        this.callParent(arguments); // call the superclass initComponent method

        var me = this,
            clientId = me.getClientId();

        if (me.getDeveloperKey()===null || clientId===null) {
            Ext.log('Jarvus.form.GooglePicker must be configured with a developerKey and clientId');
            return false;
        }

        // Allow appId to be specified, but it should be first number in clientId
        if (me.getAppId()===null) {
            me.setAppId(clientId.substring(0,clientId.indexOf('-')));
        }

        if (me.getAuthorizationScope()) {
            window.gapi.load('auth', {
                'callback': Ext.Function.bind(me.onAuthApiLoad,me)
            });
        }
        else
        {
            me.createPicker();
        }
    },

    onAuthApiLoad: function() {
        var me = this;

        window.gapi.auth.authorize(
        {
            'client_id': me.getClientId(),
            'scope': me.getAuthorizationScope(),
            'immediate': me.getAuthorizationImmediate()
        },
        Ext.Function.bind(me.handleAuthResult,me));
    },

    handleAuthResult: function(authResult) {
        var me = this;

        if (authResult && !authResult.error) {
            me.setOauthToken(authResult.access_token);
            me.createPicker();

            // Un-comment this is you want a link to revoke the token for testing purposes
            //console.log('revoke: https://accounts.google.com/o/oauth2/revoke?token=' + authResult.access_token);
        }
    },

    createPicker: function() {
        var me = this,
            pb = new google.picker.PickerBuilder();

        pb.addView(google.picker.ViewId.DOCS);
        pb.setAppId(me.getAppId());
        pb.setOAuthToken(me.getOauthToken());
        pb.setOrigin(window.location.protocol + '//' + window.location.host);
        pb.setCallback(Ext.Function.bind(me.pickerCallback,me));
        picker = pb.build();

        picker.setVisible(true);

        me.setPicker(picker);
    },

    pickerCallback: function(data) {
        var url = 'nothing';

        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          url = doc[google.picker.Document.URL];
        }
        var message = 'You picked: ' + url;
        console.log(message);
    }

});
