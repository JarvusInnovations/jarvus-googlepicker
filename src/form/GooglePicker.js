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
        picker: null,
        views: [],
        showImmediately: false
    },

    initialize: function() {
        this.callParent(arguments);

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
            if (me.getShowImmediately()) {
                me.createPicker();
            }

            // Un-comment this is you want a link to revoke the token for testing purposes
            //console.log('revoke: https://accounts.google.com/o/oauth2/revoke?token=' + authResult.access_token);
        }
    },

    createPicker: function() {
        var me = this,
            pb = new google.picker.PickerBuilder(),
            views = me.getViews(),
            viewCount = views.length,
            view, i;

        for (i=0; i<viewCount; i++) {
            view = views[i];
            if (view === 'DOCS_UPLOAD') {
                // no ViewId subclass defined for docs upload for some reason
                pb.addView(new google.picker.DocsUploadView());
            } else {
                pb.addView(google.picker.ViewId[view]);
            }
        }

        pb.setAppId(me.getAppId());
        pb.setOAuthToken(me.getOauthToken());
        pb.setOrigin(window.location.protocol + '//' + window.location.host);
        pb.setCallback(Ext.Function.bind(me.pickerCallback,me));
        picker = pb.build();

        picker.setVisible(true);

        me.setPicker(picker);
    },

    pickerCallback: function(data) {
        var me = this;

        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            me.fireEvent('picked',{response: data});
        }
        if (data[google.picker.Response.ACTION] == google.picker.Action.CANCEL) {
            me.fireEvent('cancel',{response: data});
        }
    }

});
