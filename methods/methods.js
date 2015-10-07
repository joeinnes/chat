/* jshint strict:false */
/* globals Meteor, Messages, Channels */

Users = Meteor.users;

Meteor.methods({
  addMessage: function(text, channel) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if(text.length === 0) {
      throw new Meteor.Error('your-lip-are-sealed');
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
      throw new Meteor.Error('not-authorised');
    }

    if (Channels.findOne({channelName: text})) {
      throw new Meteor.Error('channel-exists');
    }

    Channels.insert({
      channelName: text,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      access: [Meteor.userId()],
      global: true,
    });
  },

  removeChannel: function(channel) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.find(channel)) {
      throw new Meteor.Error('no-such-channel-exists');
    }

    /* Only creator can delete channel */
    if (Channels.findOne({_id: channel}).createdBy !== Meteor.userId()) {
      throw new Meteor.Error('not-channel-owner');
    }

    var channelName = Channels.findOne(channel).channelName;
    Messages.remove({channel: channelName});
    Channels.remove(channel);
  },

  removeMessage: function(message) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
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

  setChannelPublic: function(channelId, value) {
    // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.findOne({_id: channelId})) {
      throw new Meteor.Error('channel-does-not-exist-or-you-are-not-authorised-to-see-it');
    }

    if (Channels.findOne({_id: channelId}).createdBy !== Meteor.userId()) {
      throw new Meteor.Error('not-channel-owner');
    }

    Channels.update({
      _id: channelId,
    }, {
      $set: {
        global: value,
      },
    });
  },

  manageUserAccess: function(channelId, users, grantOrDeny) {
        // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.findOne({_id: channelId})) {
      throw new Meteor.Error('channel-does-not-exist-or-you-are-not-authorised-to-see-it');
    }

    if (Channels.findOne({_id: channelId}).createdBy !== Meteor.userId()) {
      throw new Meteor.Error('not-channel-owner');
    }

    if (grantOrDeny === "grant") {
      Channels.update({
        _id: channelId,
      }, {
        $addToSet: {
          access: {
            $each: users,
          },
        },
      });
    } else if (grantOrDeny === "deny") {
      Channels.update({
        _id: channelId,
      }, {
        $pullAll: {
          access: users,
        },
      });
    } else {
      throw new Meteor.Error('unrecognised-instruction');
    }
  },

});
