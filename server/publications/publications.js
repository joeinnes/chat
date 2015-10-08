/* jshint strict:false */
/* globals Meteor, Messages, Channels, Users, Emojis */

Meteor.publish('messages', function() {
  var userId = this.userId;
  var authorisedChannels = [];
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
  }).forEach(function(doc) {authorisedChannels.push(doc.channelName);});
  var selector = {channel: {$in: authorisedChannels}};
  return Messages.find(selector);
});

Meteor.publish('channels', function() {
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

Meteor.publish('users', function() {
  return Users.find({}, {
    fields: {
      username: 1,
      _id: 1,
      email: 1,
    },
  });
});

Meteor.publish('emojis', function() {
  // Here you can choose to publish a subset of all emojis
  // if you'd like to.
  return Emojis.find();
});