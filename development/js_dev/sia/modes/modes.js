// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for mode modules SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.modes');
goog.provide('sia.modes.Mode');
goog.provide('sia.modes.ModeType');
goog.provide('sia.modes.ConfirmingMode');
goog.provide('sia.modes.PresettingMode');
goog.provide('sia.modes.PretestingMode');
goog.provide('sia.modes.SettingMode');
goog.provide('sia.modes.TestingMode');
goog.require('goog.debug.LogManager');
goog.require('sia.ui.ControlPanel.ButtonMsg');
goog.require('sia.ui.ControlPanel.SymbolType');



/**
 * A class for abstract mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 */
sia.modes.Mode = function(app) {
  this.app_ = app;
};


/**
 * @enum {number}
 */
sia.modes.ModeType = {
  PRE_SETTING: 0,
  SETTING: 1,
  PRE_TESTING: 2,
  TESTING: 3,
  CONFIRMING: 4
};


/**
 * Returns an application.
 * @return {sia.App} Application for the mode.
 */
sia.modes.Mode.prototype.getApp = function() {
  return this.app_;
};


/**
 * Returns a next mode.
 */
sia.modes.Mode.prototype.next = goog.abstractMethod;



/**
 * A class for presetting mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 * @extends {sia.modes.Mode}
 */
sia.modes.PresettingMode = function(app) {
  goog.base(this, app);
};
goog.inherits(sia.modes.PresettingMode, sia.modes.Mode);


/** @override */
sia.modes.PresettingMode.prototype.next = function() {
  var app = this.getApp();
  var controlPanel = app.getControlPanel();
  var next = app.getMode(sia.modes.ModeType.SETTING);

  if (sia.debug.LOG_ENABLED) {
    var logger = goog.debug.LogManager.getLogger('sia.modes.PresettingMode');
    logger.finer('Sets an authenticator.');
  }

  controlPanel.setVisible(false);
  app.setMode(next);
};



/**
 * A class for setting mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 * @extends {sia.modes.Mode}
 */
sia.modes.SettingMode = function(app) {
  goog.base(this, app);
};
goog.inherits(sia.modes.SettingMode, sia.modes.Mode);


/** @override */
sia.modes.SettingMode.prototype.next = function() {
  var app = this.getApp();
  var controlPanel = app.getControlPanel();
  var next = app.getMode(sia.modes.ModeType.PRE_TESTING);
  var last = app.getLastInput();

  if (sia.debug.LOG_ENABLED) {
    var logger = goog.debug.LogManager.getLogger('sia.modes.SettingMode');
    logger.finer('Set correct: ' + last.toString() + ' as ' +
        last.toString(true));
  }

  controlPanel.setSymbolVisible(sia.ui.ControlPanel.SymbolType.PADLOCK);
  app.getAutheticationHelper().setCorrect(last);
  app.getAppInterface().getKeypad().getCombinationalSymbols().clear();

  controlPanel.setButtonMsg(sia.ui.ControlPanel.ButtonMsg.TEST);
  app.updateControlPanel();
  controlPanel.setVisible(true);
  app.setMode(next);
};



/**
 * A class for pretesting mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 * @extends {sia.modes.Mode}
 */
sia.modes.PretestingMode = function(app) {
  goog.base(this, app);
};
goog.inherits(sia.modes.PretestingMode, sia.modes.Mode);


/** @override */
sia.modes.PretestingMode.prototype.next = function() {
  var app = this.getApp();
  var controlPanel = app.getControlPanel();
  var next = app.getMode(sia.modes.ModeType.TESTING);

  if (sia.debug.LOG_ENABLED) {
    var logger = goog.debug.LogManager.getLogger('sia.modes.PretestingMode');
    logger.finer('Tests an authenticator.');
  }

  controlPanel.setVisible(false);
  app.setMode(next);
};



/**
 * A class for testing mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 * @extends {sia.modes.Mode}
 */
sia.modes.TestingMode = function(app) {
  goog.base(this, app);
};
goog.inherits(sia.modes.TestingMode, sia.modes.Mode);


/** @override */
sia.modes.TestingMode.prototype.next = function() {
  var app = this.getApp();
  var controlPanel = app.getControlPanel();
  var next = app.getMode(sia.modes.ModeType.CONFIRMING);
  var last = app.getLastInput();

  if (sia.debug.LOG_ENABLED) {
    var logger = goog.debug.LogManager.getLogger('sia.modes.TestingMode');
    logger.finer('Prepares testing.');
  }

  if (app.getAutheticationHelper().authenticate(last)) {
    controlPanel.setSymbolVisible(sia.ui.ControlPanel.SymbolType.CORRECT);
  }
  else {
    controlPanel.setSymbolVisible(sia.ui.ControlPanel.SymbolType.WRONG);
  }

  controlPanel.setButtonMsg(sia.ui.ControlPanel.ButtonMsg.OK);
  app.updateControlPanel();
  controlPanel.setVisible(true);
  app.setMode(next);
};



/**
 * A class for confirming mode.
 * @param {sia.App} app Application for the mode.
 * @constructor
 * @extends {sia.modes.Mode}
 */
sia.modes.ConfirmingMode = function(app) {
  goog.base(this, app);
};
goog.inherits(sia.modes.ConfirmingMode, sia.modes.Mode);


/** @override */
sia.modes.ConfirmingMode.prototype.next = function() {
  var app = this.getApp();
  var controlPanel = app.getControlPanel();
  var next = app.getMode(sia.modes.ModeType.PRE_SETTING);

  if (sia.debug.LOG_ENABLED) {
    var logger = goog.debug.LogManager.getLogger('sia.modes.ConfirmingMode');
    logger.finer('Confirming.');
  }

  controlPanel.setSymbolVisible(sia.ui.ControlPanel.SymbolType.KEY);

  app.getAutheticationHelper().getCorrect().clear();
  app.getAppInterface().getKeypad().getCombinationalSymbols().clear();

  controlPanel.setButtonMsg(sia.ui.ControlPanel.ButtonMsg.SET);
  app.updateControlPanel();
  app.setMode(next);
};
