/* jshint strict:false */
/* globals Meteor, Messages, Channels */

Users = Meteor.users;

Meteor.methods({
  addMessage: function(text, channel) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.insert({
      text: text,
      createdAt: new Date(),
      createdBy: Meteor.user(),
      channel: channel,
    });
  },

  addChannel: function(text) {
    // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (Channels.findOne({channelName: text})) {
      throw new Meteor.Error('channel-exists');
    }

    Channels.insert({
      channelName: text,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      access: ['public'],
    });
  },

  removeChannel: function(channel) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Channels.find(channel)) {
      throw new Meteor.Error('no-such-channel-exists');
    }

    /* Only creator can delete channel */
    if (Channels.findOne({_id: channel}).createdBy !== Meteor.userId()) {
      throw new Meteor.Error('not-channel-owner');
    }

    Channels.remove(channel);
  },

  removeMessage: function(message) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Messages.find(message)) {
      throw new Meteor.Error('no-such-message-exists');
    }

    /* Only creator can delete message */
    if (Messages.findOne({_id: message}).createdBy._id !== Meteor.userId()) {
      throw new Meteor.Error('not-message-owner');
    }

    Messages.remove(message);
  },
});
