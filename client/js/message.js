/* jshint strict:false */
/* globals moment, Template */

Template.message.helpers({
  createdAtTime: function(time) {
    return moment(time).fromNow();
  },

  usersOwn: function(thisUser, createdBy) {
    if (thisUser === createdBy) {
      return true;
    } else {
      return false;
    }
  },
});
