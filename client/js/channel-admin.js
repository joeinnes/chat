/* globals Channels */

Template.channeladmin.helpers({
    adminChannel: function() {
        return Session.get('adminChannel');
    },
    channelDetails: function() {
        return Channels.findOne({channelName: Session.get('adminChannel')});
    },
    users: function() {
        return Users.find({}, {sort: {createdAt: -1}});
    },
});

Template.channeladmin.events({
  'click .make-public': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    swal({
      title: 'Are you sure?',
      text: 'Everyone will be able to read messages in this channel',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, make it public!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function(isConfirm) {
      if (isConfirm) {
        Meteor.call('setChannelPublic', event.target.id, true, function(err) {
          if (err) {
            swal('Error', 'The channel could not be made public\n' + err, 'error');
          } else {
            swal('Channel now public!!', 'Channel has been made public.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The channel has not been made public', 'error');
      }
    });
  },

  'click .make-private': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
    swal({
      title: 'Are you sure?',
      text: 'Only authorised users will be able to read messages in this channel',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, make it private!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function(isConfirm) {
      if (isConfirm) {
        Meteor.call('setChannelPublic', event.target.id, false, function(err) {
          if (err) {
            swal('Error', 'The channel could not be made private\n' + err, 'error');
          } else {
            swal('Channel now private!', 'Channel has been made private.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The channel has not been made private', 'error');
      }
    });
  },

  'submit .user-add-form': function() {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var usernames = $('.ui.dropdown.add-user').dropdown('get value');
    var channelId = event.target.id;

  swal({
      title: 'Are you sure?',
      text: 'Selected users will be able to read messages in this channel',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, add them!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function(isConfirm) {
      if (isConfirm) {
        Meteor.call('manageUserAccess', channelId, usernames, 'grant', function(err) {
          if (err) {
            swal('Error', 'Users could not be added\n' + err, 'error');
          } else {
            swal('Added!', 'Users were added!.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The users were not added', 'error');
      }
    });

  },

  'submit .user-remove-form': function() {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var usernames = $('.ui.dropdown.remove-user').dropdown('get value');
    var channelId = event.target.id;
swal({
      title: 'Are you sure?',
      text: 'Selected users will no longer be able to read messages in this channel',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, remove them!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function(isConfirm) {
      if (isConfirm) {
        Meteor.call('manageUserAccess', channelId, usernames, 'deny', function(err) {
          if (err) {
            swal('Error', 'Users could not be removed\n' + err, 'error');
          } else {
            swal('Added!', 'Users were removed!.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The users were not removed', 'error');
      }
    });
  },
});

Template.channeladmin.onRendered(function() {
    $('.ui.dropdown').dropdown();
});