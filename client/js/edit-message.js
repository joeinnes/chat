/* jshint strict:false */
/* globals Messages, Meteor, Session, Template */

Template.editmessage.events({
  'submit .edit-message': function(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;
    var id = event.target.id;

    Meteor.call('editMessage', id, text);

    // Clear form
    event.target.text.value = '';
    Session.set('editingId', '');
  },
  'click .cancel-edit-message': function() {
    $('.edit-message.text').val('');
    Session.set('editingId', '');
  },
});

Template.editmessage.helpers({
  message: function() {
    return Messages.findOne({_id: Session.get('editingId')});
  },
  messageText: function() {
    return Messages.findOne({_id: Session.get('editingId')}).text;
  },
  displayEditingWindow: function() {
    if (Session.get('editingId') !== '' && typeof Session.get('editingId') !== 'undefined') {
      return true;
    } else {
      return false;
    }
  },
});