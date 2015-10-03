/* jshint strict:false */
/* globals Template, Meteor */

Template.channeladd.events({
  'submit .new-channel': function(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.name.value;

    Meteor.call('addChannel', text);

    // Clear form
    event.target.name.value = '';
  },
});
