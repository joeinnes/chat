/* global $ */
/* jshint strict:false */
/* globals Template, Meteor */

Template.header.onRendered(function() {
  $(".button-collapse").sideNav({
    closeOnClick: true
  });
});
