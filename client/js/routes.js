/* jshint strict:false */
/* globals Router, Session */

Router.configure({
  layoutTemplate: 'app',
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
  }, {
  name: 'user',
  data: {
    user: function() {
    return Users.findOne(Session.get('userview'));
    },
  },
  }
);

Router.route('/about', function() {
  this.render('about');
  }, {
    name: 'about',
  }
);