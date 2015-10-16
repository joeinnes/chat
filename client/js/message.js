/* jshint strict:false */
/* globals moment, Template, swal, Meteor */

Template.message.helpers({
  usersOwn: function(thisUser, createdBy) {
    if (thisUser === createdBy) {
      return true;
    } else {
      return false;
    }
  },
  editThis: function(thisId) {
    if (Session.get('editingId') === thisId) {
      return true;
    } else {
      return false;
    }
  },
  emojiAliased: function(text) {
    var returnedText = text;
    // Add the :* as an alias for kissing_heart
    returnedText = returnedText.replace(/:\*/g, ":kissing_heart:");
    return returnedText;
  }
});

Template.message.events({
  'click .delete-message': function() {
    var messageId = this._id;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this message!',
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
        Meteor.call('removeMessage', messageId, function(err) {
          if (err) {
            swal('Error', 'The message could not be deleted\n' + err, 'error');
          } else {
            swal('Deleted!', 'Message has been deleted.', 'success');
          }
        });

      } else {
        swal('Cancelled', 'The message has not been deleted', 'error');
      }
    });
  },
  'click .edit-message': function(event) {
    var messageId = event.target.id;
    Session.set('editingId', messageId);
  },
});
