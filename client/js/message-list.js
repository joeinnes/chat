/* jshint strict:false */
/* globals Messages, Session, Template */

Template.messagelist.helpers({
  messages: function() {
    return Messages.find({channel: Session.get('currentChannel')}, {sort: {createdAt: -1}});
  },
});

Template.messagelist.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('messages', Session.get('currentChannel'), {sort: {createdAt: -1}});
  });
});
