/* jshint strict:false */
/* globals Meteor, Messages, Channels, Users */

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
