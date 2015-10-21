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
    self.subscribe('messages', Session.get('currentChannel'), Session.get('itemsLimit'), {});
    var timer;

    $(window).on("blur focus", function (e) {
      var prevType = $(this).data("prevType");

      if (prevType != e.type) { //  reduce double fire issues
        switch (e.type) {
        case "blur":
          /*var initialising = true;
          Messages.observer = Messages.find({
            channel: Session.get('currentChannel')
          }).observe({
            added: function (doc) {
              if (!initialising) {
                timer = window.setInterval(function () {
                  window.document.title = window.document.title == "Mokus" ? "New message..." : "Mokus";
                }, 800);
              }
            }
          });
          initialising = false;*/
         var initialising = true;
         Notifications.observer = Notifications.find({
            fao: Meteor.userId(),
            read: false,
          }).observe({
            added: function (doc) {
              timer = window.setInterval(function () {
                window.document.title = window.document.title === "Mokus" ? "New notifications..." : "Mokus";
              }, 500);
            }
          });
          initialising = false;

          unreadNotifications = Notifications.find({fao: Meteor.userId(), read: false}).count();
          if (unreadNotifications > 0) {

          }
          break;
        case "focus":
          var initialising = true;
         Notifications.observer = Notifications.find({
            fao: Meteor.userId(),
            read: false,
          }).observe({
            added: function (doc) {
              if (!initialising) {
                Meteor.call('readNotification', doc._id);
              }
            }
          });
          initialising = false;


          if (Router.current().route.getName() ===  'channel') {
            Meteor.call('readNotification', 'channel', Session.get('currentChannel'));
          } else if (Router.current().route.getName() ===  'user') {
            Meteor.call('readNotification', 'user', Session.get('userview'));
          }

          clearInterval(timer);
          window.document.title = 'Mokus';
          break;
        }
      }

      $(this).data("prevType", e.type);
    })
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