/* jshint strict:false */
/* globals Meteor, Messages, Channels, Users, Emojis */

Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('channels', function() {
  var userId = this.userId;
  return Channels.find({
    access: {
      $in: [
        'public',
        userId,
      ],
    },
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