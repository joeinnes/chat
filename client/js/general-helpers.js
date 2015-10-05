/* globals moment */

Template.registerHelper('isCurrentChannel', function() {
  return Session.get('currentChannel');
});

Template.registerHelper('createdAtTime', function(time) {
    return moment(time).fromNow();
});