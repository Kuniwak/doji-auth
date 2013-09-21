// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for authentication helper module for SIA
 *   (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.auth.AuthenticationHelper');
goog.require('goog.asserts');



/**
 * A class for authentication helper.
 *
 * @constructor
 * @param {*=} opt_correct Autheticator is an any object has {@code a.equals(b)}
 *   method.
 */
sia.auth.AuthenticationHelper = function(opt_correct) {
  if (opt_correct) {
    this.setCorrect(opt_correct);
  }
};


/**
 * Sets an indentification.
 * @param {*} correct Autheticator is an any object has {@code a.equals(b)}
 *   method.
 */
sia.auth.AuthenticationHelper.prototype.setCorrect = function(correct) {
  this.correct_ = correct;
};


/**
 * Returns an indentification.
 * @return {*} Autheticator is an any object has {@code a.equals(b)} method.
 */
sia.auth.AuthenticationHelper.prototype.getCorrect = function() {
  return this.correct_;
};


/**
 * Authenticates a authenticator.
 * @param {*} auth The autheticator.
 * @return {boolean} Whether authenticator was matched.
 */
sia.auth.AuthenticationHelper.prototype.authenticate = function(auth) {
  goog.asserts.assert(this.correct_ && this.correct_.equals);
  return this.correct_.equals(auth);
};
