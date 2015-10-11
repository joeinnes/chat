/* jshint strict:false */
/* globals Messages, Session, Template */

Template.messagelist.helpers({
  messages: function () {
    return Messages.find({
      channel: Session.get('currentChannel')
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
});

Template.messagelist.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('messages', Session.get('currentChannel'), {
      sort: {
        createdAt: -1
      }
    });
    var timer;
    $(window).blur(function () {
      var initialising = true;
      Messages.observer = Messages.find({
        channel: Session.get('currentChannel')
      }).observe({
        added: function (doc) {
          if (!initialising) {
            timer = window.setInterval(function() {
              window.document.title = window.document.title == "Mokus" ? "New message..." : "Mokus";
            }, 800);
          }
        }
      });
      initialising = false;
    });

    $(window).focus(function () {
      if (Messages.observer) {
        Messages.observer.stop(); // Call the stop
      }
      clearInterval(timer);
      window.document.title = 'Mokus';
    });
  });
});