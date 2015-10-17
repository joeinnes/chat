/* jshint strict:false */
/* globals Messages, Session, Template, ItemsIncrement */

Template.messagelist.helpers({
  messages: function () {
    return Messages.find();
    /*{
      channel: Session.get('currentChannel')
    }, {
      sort: {
        createdAt: -1
      }
    });*/
  },
  moreResults: function() {
    return !(Messages.find().count() < Session.get("itemsLimit"));
  },
});

Template.messagelist.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('messages', Session.get('currentChannel'), Session.get('itemsLimit'), {
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
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);
