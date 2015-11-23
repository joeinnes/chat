/* jshint strict:false */
/* globals Router, Session */

Router.configure({
  layoutTemplate: 'app',
});

Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('signup');
  } else {
    this.next();
  }
});

Router.route('/', function() {
  this.redirect('/channel/general');
  }, {
    name: 'home',
  }
);

Router.route('/channel/:channel', function() {
  Session.set('currentChannel', this.params.channel);
  this.render('room');
  Meteor.call('readNotification', 'channel', Session.get('currentChannel'));
  }, {
    name: 'channel',
  }
);

Router.route('/admin/:channel', function() {
  Session.set('adminChannel', this.params.channel);
  this.render('channeladmin');
  }, {
  name: 'admin',
  }
);

Router.route('/user/:user', function() {
  Session.set('userview', this.params.user);
  this.render('user');
  Meteor.call('readNotification', 'user', Session.get('userview'));
  }, {
  name: 'user',
  data: {
    user: function() {
    return Users.findOne(Session.get('userview'));
    },
  },
  }
);

Router.route('/register', function() {
  this.render('signup');
  console.log('Rendering signup');
  }, {
  name: 'signup',
  }
);
