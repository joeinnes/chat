Template.userlist.helpers({
  users: function() {
    return Users.find({}, {sort: {createdAt: -1}});
  },
});
