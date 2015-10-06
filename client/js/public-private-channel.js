Template.publicprivatechannel.helpers({
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
});

Template.publicprivatechannel.events({
  'click .make-public': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    Meteor.call('setChannelPublic', event.target.id, true);
  },

  'click .make-private': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    Meteor.call('setChannelPublic', event.target.id, false);
  },
});