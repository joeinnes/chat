/* jshint strict:false */
/* globals Meteor, Session, Template */

Template.newmessage.events({
  'submit .new-message': function (event) {
    // Prevent default browser form submit
    event.preventDefault();
    console.log(event.target);

    // Get value from form element
    var text = event.target.text.value;

    Meteor.call('addMessage', text, Session.get('currentChannel'));

    // Clear form
    event.target.text.value = '';
  }
});