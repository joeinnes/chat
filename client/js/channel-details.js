/* globals Channels, Session */

Template.channeldetails.helpers({
    adminChannel: function() {
        return Session.get('adminChannel');
    },
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
    isPublic: function() {
      if (Channels.findOne({channelName: Session.get('adminChannel')}).public) {
        return 'Yes';
      } else{
        return 'No';
      }
    },
    fullUserFromId: function(userId) {
     return Users.findOne(userId);
    },
});