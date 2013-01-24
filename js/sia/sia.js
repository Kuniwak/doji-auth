// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for SIA (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.Component');
goog.require('sia.ui.NumericalKeypad');

var NUMERICAL_KEYPAD_ID = 'sia-keys';
var numKeys = new sia.ui.NumericalKeypad();
numKeys.decorate(goog.dom.getElement(NUMERICAL_KEYPAD_ID));
window.NUM_KEYS = numKeys;
