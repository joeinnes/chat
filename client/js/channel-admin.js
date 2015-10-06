/* globals Channels */

Template.channeladmin.helpers({
    adminChannel: function() {
        return Session.get('adminChannel');
    },
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
    publicChannel: function(channelId, value) {
        Meteor.call('setChannelPublic', channelId, value);
    },
    users: function() {
        return Users.find({}, {sort: {createdAt: -1}});
    },
});

Template.channeladmin.events({
  'click .make-public': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    Meteor.call('setChannelPublic', event.target.id, true);
  },

  'click .make-private': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    Meteor.call('setChannelPublic', event.target.id, false);
  },

  'submit .user-add-form': function() {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var usernames = $('.ui.dropdown.add-user').dropdown('get value');
    var channelId = event.target.id;

    Meteor.call('manageUserAccess', channelId, usernames, 'grant');

  },

  'submit .user-remove-form': function() {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var usernames = $('.ui.dropdown.remove-user').dropdown('get value');
    var channelId = event.target.id;

    Meteor.call('manageUserAccess', channelId, usernames, 'deny');

  },
});

Template.channeladmin.onRendered(function() {
    $('.ui.dropdown').dropdown();
});