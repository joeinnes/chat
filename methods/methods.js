/* jshint strict:false */
/* globals Meteor, Messages, Channels */

Users = Meteor.users;

Meteor.methods({
  addMessage: function (text, channel) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (text.length === 0) {
      throw new Meteor.Error('your-lips-are-sealed');
    }

    if (!Channels.findOne({
        channelName: channel,
        $or: [{
          access: {
            $in: [
              Meteor.userId(),
            ],
          },
        }, {
          global: true,
        }],
      })) {
      throw new Meteor.Error('channel-does-not-exist-or-you-are-not-authorised-to-use-it');
    }

    var userObj = {};
    userObj._id = Meteor.user()._id;
    userObj.username = Meteor.user().username;
    userObj.emails = Meteor.user().emails;

    var message = {
      text: text,
      createdAt: new Date(),
      createdBy: userObj,
      channel: channel,
    };

    Messages.insert(message);

    Meteor.call('notifySubscribers', message);
  },

  addChannel: function (text) {
    // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (Channels.findOne({
        channelName: text
      })) {
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

  removeChannel: function (channel) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.find(channel)) {
      throw new Meteor.Error('no-such-channel-exists');
    }

    /* Only creator can delete channel */
    if (Channels.findOne({
        _id: channel
      }).createdBy !== Meteor.userId()) {
      throw new Meteor.Error('not-channel-owner');
    }

    var channelName = Channels.findOne(channel).channelName;
    Messages.remove({
      channel: channelName
    });
    Channels.remove(channel);
  },

  removeMessage: function (message) {
    // Make sure the user is logged in before removing a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Messages.find(message)) {
      throw new Meteor.Error('no-such-message-exists');
    }

    /* Only creator can delete message */
    if (Messages.findOne({
        _id: message
      }).createdBy._id !== Meteor.userId()) {
      throw new Meteor.Error('not-message-owner');
    }

    Messages.remove(message);
  },

  setChannelPublic: function (channelId, value) {
    // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.findOne({
        _id: channelId
      })) {
      throw new Meteor.Error('channel-does-not-exist-or-you-are-not-authorised-to-see-it');
    }

    if (Channels.findOne({
        _id: channelId
      }).createdBy !== Meteor.userId()) {
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

  manageUserAccess: function (channelId, users, grantOrDeny) {
    // Make sure the user is logged in before inserting a channel
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (!Channels.findOne({
        _id: channelId
      })) {
      throw new Meteor.Error('channel-does-not-exist-or-you-are-not-authorised-to-see-it');
    }

    if (Channels.findOne({
        _id: channelId
      }).createdBy !== Meteor.userId()) {
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
    }
    else if (grantOrDeny === "deny") {
      Channels.update({
        _id: channelId,
      }, {
        $pullAll: {
          access: users,
        },
      });
    }
    else {
      throw new Meteor.Error('unrecognised-instruction');
    }
  },

  editMessage: function (id, text) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }

    if (text.length === 0) {
      throw new Meteor.Error('your-lip-are-sealed');
    }

    if (!Messages.findOne({
        _id: id
      })) {
      throw new Meteor.Error('message-does-not-exist-or-you-are-not-authorised-to-see-it');
    }

    if (Messages.findOne({
        _id: id
      }).createdBy._id !== Meteor.userId()) {
      throw new Meteor.Error('not-message-owner');
    }

    Messages.update({
      _id: id,
    }, {
      $set: {
        text: text,
        edited: new Date(),
      },
    });
  },

  addSubscription: function (id, channelOrUser) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-logged-in');
    }

    if (!Meteor.user().profile.subscriptions) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.subscriptions": {},
        }
      });
    }

    if (channelOrUser === 'channel') {

      if (Meteor.user().profile.subscriptions.channels instanceof Array) {
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.channels": id
          }
        });
      }
      else {
        Meteor.users.update(Meteor.userId(), {
          $set: {
            "profile.subscriptions.channels": []
          }
        });
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.channels": id
          }
        });
      }

    }
    else if (channelOrUser === 'user') {

      if (Meteor.user().profile.subscriptions.users instanceof Array) {
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.users": id
          }
        });
      }
      else {
        Meteor.users.update(Meteor.userId(), {
          $set: {
            "profile.subscriptions.users": []
          }
        });
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.users": id
          }
        });
      }

    }
    else {
      throw new Meteor.Error('not-valid-subscription-type');
    }
  },

  removeSubscription: function (id, channelOrUser) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-logged-in');
    }

    if (channelOrUser === 'channel') {

      if (Meteor.user().profile.subscriptions.channels instanceof Array && Meteor.user().profile.subscriptions.channels.indexOf(id) > -1) {
        Meteor.users.update(Meteor.userId(), {
          $pull: {
            "profile.subscriptions.channels": id
          }
        });
      }
      else {
        throw new Meteor.Error('not-subscribed');
      }

    }
    else if (channelOrUser === 'user') {

      if (Meteor.user().profile.subscriptions.users instanceof Array) {
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.users": id
          }
        });
      }
      else {
        Meteor.users.update(Meteor.userId(), {
          $set: {
            "profile.subscriptions.users": []
          }
        });
        Meteor.users.update(Meteor.userId(), {
          $addToSet: {
            "profile.subscriptions.users": id
          }
        });
      }

    }
    else {
      throw new Meteor.Error('not-valid-subscription-type');
    }
  },

  notifySubscribers: function (message) {
    var notification = {};
    var subscribedToUser = [];
    var subscribedToChannel = [];
    var channelId = Channels.findOne({channelName: message.channel})._id;
   // Find all users subscribed to this user and create an array of users to notify
    subscribedToUser = Users.find({'profile.subscriptions.users': message.createdBy._id}, {fields: {id: 1}}).fetch();

   // Find all users subscribed to this channel and create an array of users to notify
    subscribedToChannel = Users.find({'profile.subscriptions.channels': channelId}, {fields: {id:1}}).fetch();

    var subscribedUsers = subscribedToUser.concat(subscribedToChannel);

   // Iterate through the array and insert a notification for each user

   for (var i = 0; i < subscribedUsers.length; i++) {
    notification = {
       fao: subscribedUsers[i]._id,
       read: false,
       message: message,
     };
     Notifications.insert(notification);
   }

  }
});
