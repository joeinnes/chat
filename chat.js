/*global Messages*/

Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
  // This code only runs on the client
  Session.set('documentLoading', true);
  Meteor.subscribe("messages");

  Template.body.helpers({
    messages: function () {
      return Messages.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.loading.onRendered(function() {
    /* Accounts.onLogin(function() {
      var userEmail = Meteor.user().emails[0].address;
      Session.set('documentLoading', false);
      Session.set('userImage', Gravatar.imageUrl(userEmail, {
        size: 34,
        default: 'mm'
      }));
    }); */
    Session.set('loading', false);
  });

  Template.message.helpers({
    createdAtTime: function(time) {
      return moment(time).fromNow();
    },
    usersOwn: function(thisUser, createdBy) {
      if ( thisUser === createdBy ) {
        return true;
      } else {
        return false;
      }
    }
  });

  Template.body.onCreated(function() {
    this.subscribe("body");
  });

    Template.body.events({
    "submit .new-message": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      Meteor.call("addMessage", text);

      // Clear form
      event.target.text.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
}

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("messages", function () {
    return Messages.find();
  });
}

Meteor.methods({
  addMessage: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.insert({
      text: text,
      createdAt: new Date(),
      createdBy: Meteor.user(),
    });
  },
});
