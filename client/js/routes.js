/* jshint strict:false */
/* globals Router, Session */

Router.configure({
  layoutTemplate: 'app',
});

Router.route('/', function() {
  this.redirect('/general');
});

Router.route('/:channel', function() {
  Session.set('currentChannel', this.params.channel);
  this.render('room');
});
