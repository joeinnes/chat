/* globals Channels, Session */

Template.channeldetails.helpers({
    adminChannel: function() {
        return Session.get('adminChannel');
    },
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
});