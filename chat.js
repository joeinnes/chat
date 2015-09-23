/*global Messages*/

Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
  // This code only runs on the client

  Meteor.subscribe("messages");
  Template.body.helpers({
    messages: function () {
      return Messages.find({}, {sort: {createdAt: -1}});
    }
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
    passwordSignupFields: "USERNAME_ONLY"
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
      createdBy: Meteor.user().username
    });
  },
});