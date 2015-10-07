/* jshint strict:false */
/* globals Template, Channels, Meteor, swal */

Template.channellist.helpers({
  channels: function() {
    return Channels.find({}, {sort: {createdAt: +1}});
  },
  usersOwn: function(thisChannelCreator, createdBy) {
    console.log(thisChannelCreator);
    console.log(createdBy);
    if (thisChannelCreator === createdBy) {
      return true;
    } else {
      return false;
    }
  },
});

Template.channellist.events({
  'click .delete-channel': function() {
    var channelId = this._id;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this channel!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function(isConfirm) {
      if (isConfirm) {
        Meteor.call('removeChannel', channelId, function(err) {
          if (err) {
            swal('Error', 'The channel could not be deleted\n' + err, 'error');
          } else {
            swal('Deleted!', 'Channel has been deleted.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The channel has not been deleted', 'error');
      }
    });
  },
});

Template.channellist.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('channels', {sort: {createdAt: +1}});
  });
});
