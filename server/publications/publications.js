/* jshint strict:false */
/* globals Meteor, Messages, Channels */

Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('channels', function() {
  return Channels.find();
});
