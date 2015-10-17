/* jshint strict:false */
/* globals Meteor, Messages, Channels, Users, Emojis */

Meteor.publish('messages', function (channel, limit, user) {

  var userId = this.userId;
  var authorisedChannels = [];
  var selector = {};
  Channels.find({
    $or: [{
      global: true
    }, {
      access: {
        $in: [
          userId,
        ],
      },
    }]
  }).forEach(function (doc) {
    authorisedChannels.push(doc.channelName);
  });

  if (channel !== 0) {
    selector = {
      $and: [{
        channel: {
          $in: authorisedChannels,
        }
      }, {
        channel: channel,
      }],
    };
  }
  else {
    selector = {
      $and: [{
        channel: {
          $in: authorisedChannels,
        }
      }, {
        'createdBy._id': user
      }]
    };
  }

  return Messages.find(selector, {
    limit: limit,
    sort: {
      createdAt: -1
    }
  });
});

Meteor.publish('channels', function () {
  var userId = this.userId;
  return Channels.find({
    $or: [{
      global: true
    }, {
      access: {
        $in: [
          userId,
        ],
      },
    }]
  });
});

Meteor.publish('users', function () {
  return Users.find({}, {
    fields: {
      username: 1,
      _id: 1,
      emails: 1,
    },
  });
});

Meteor.publish('emojis', function () {
  // Here you can choose to publish a subset of all emojis
  // if you'd like to.
  return Emojis.find();
});
