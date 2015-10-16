/* jshint strict:false */
/* globals ItemsIncrement, ReactiveTimer, Accounts, Avatar */

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

ItemsIncrement = 20;
Session.setDefault('itemsLimit', ItemsIncrement);

ReactiveTimer = new ReactiveTimer();
ReactiveTimer.start(10);

