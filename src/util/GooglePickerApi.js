/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('Jarvus.util.GooglePickerApi', {
    extend: 'Ext.ux.google.Api',

    mixins: [
        'Ext.mixin.Mashup'
    ],

    requiredScripts: [
        '//apis.google.com/js/api.js'
    ],

    requiresGoogle: [
        'picker'
    ]

});

