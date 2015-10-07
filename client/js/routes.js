/* jshint strict:false */
/* globals Router, Session */

Router.configure({
  layoutTemplate: 'app',
});

Router.route('/', function() {
  this.redirect('/channel/general');
});

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