/* globals Channels */

Template.channeladmin.helpers({
    adminChannel: function() {
        return Session.get('adminChannel');
    },
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
    findChannelAdmin: function(userId) {
        var user = Users.findOne(userId);
        if (user) {
            return user.username;
        }
    }, // todo: make this a global helper
});