/* globals moment, Users */

Template.registerHelper('isCurrentChannel', function() {
  return Session.get('currentChannel');
});

Template.registerHelper('createdAtTime', function(time) {
  return moment(time).fromNow();
});

Template.registerHelper('findUserNameFromId', function(userId) {
  var user = Users.findOne(userId);
  if (user) {
    return user.username;
  } else {
    return userId;
  }
});

Template.registerHelper('avatarUrl', function(user) {
  var email = user.emails[0].address;
  var options = {
    size: 50,
    default: 'mm',
  }
  return Gravatar.imageUrl(email, options);
});
