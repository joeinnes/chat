Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({fao: Meteor.userId(), read: false}, {sort: { 'message.createdAt': -1 }});
  },
  notificationCount: function(){
    return Notifications.find({fao: Meteor.userId(), read: false}).count();
  }
});

Template.notifications.events({
  'click .dismiss': function() {
    Meteor.call('readNotification', this._id);
  },
  'click .notification': function() {
    Meteor.call('readNotification', this._id);
  },
  'click .dismissall': function() {
    Meteor.call('readNotification', 'all');
  },
});

Template.notifications.onRendered(function () {
  $(".dropdown-button").dropdown();
});

