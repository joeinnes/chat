/* jshint strict:false */
/* globals Template, Channels, Meteor, Session */

Template.channellist.helpers({
  channels: function() {
    return Channels.find({}, {sort: {createdAt: +1}});
  },
});

Template.channellist.events({
  'click .delete-channel': function() {
    Meteor.call('removeChannel', this._id);
  },
});
