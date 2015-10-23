/* jshint strict:false */
/* globals Messages, Session, Template, ItemsIncrement */

Template.messagelist.helpers({
  messages: function () {
    return Messages.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
  moreResults: function () {
    return !(Messages.find().count() < Session.get("itemsLimit"));
  },
});

Template.messagelist.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var initialising = true;
    var timer;

    self.subscribe('messages', Session.get('currentChannel'), Session.get('itemsLimit'), {});
    self.subscribe('notifications');

    Notifications.observer = Notifications.find({
      fao: Meteor.userId(),
      read: false,
    }).observe({
      added: function (doc) {
        if (!initialising) {
          if (!document.hasFocus()) {
            notifyMe(doc);
          } else {
            // Otherwise, find out whether the user is looking at a channel or a user
            if (Router.current().route.getName() === 'channel') {
              // If the user is looking at a channel, mark all notifications from that channel as read
              Meteor.call('readNotification', 'channel', Session.get('currentChannel'));
            } else if (Router.current().route.getName() === 'user') {
              // If the user is looking at a user, mark all notifications from that user as read
              Meteor.call('readNotification', 'user', Session.get('userview'));
            }
          }
        }
      }
    });

    initialising = false;


    $(window).on('focus', function () {
      FlashTitle.stop();
      // When the window gets focus, check what the user is looking at
      if (Router.current().route.getName() === 'channel') {
        // If the user is looking at a channel, mark all notifications from that channel as read
        Meteor.call('readNotification', 'channel', Session.get('currentChannel'));
      }
      else if (Router.current().route.getName() === 'user') {
        // If the user is looking at a user, mark all notifications from that user as read
        Meteor.call('readNotification', 'user', Session.get('userview'));
      }
    });
  });
});


function showMoreVisible() {
  var threshold, target = $("#showMoreResults");
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height();

  if (target.offset().top < threshold) {
    if (!target.data("visible")) {
      target.data("visible", true);
      Session.set("itemsLimit",
        Session.get("itemsLimit") + ItemsIncrement);
    }
  }
  else {
    if (target.data("visible")) {
      target.data("visible", false);
    }
  }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);

function notifyMe(doc) {
  // Let's check if the browser supports notifications
  var options = {
      body: doc.message.createdBy.username + ' said ' + doc.message.text,
  }

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("New notification", options);
    FlashTitle.start();
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("New notification", options);
        FlashTitle.start();
      }
    });
  }
}

FlashTitle = {
  start: function() {
    FlashTitle.timer=window.setInterval(function() {
      document.title = document.title == "Mokus" ? "New notification..." : "Mokus";
    }, 1000);
  },
  stop: function() {
    document.title = "Mokus";
    clearInterval(FlashTitle.timer);
  },
  timer: '',
}