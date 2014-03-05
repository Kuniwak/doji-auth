// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.App');

goog.require('goog.asserts');
goog.require('goog.debug.Console');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');
goog.require('goog.dom.DomHelper');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('sia.auth.AuthenticationHelper');
goog.require('sia.debug');
goog.require('sia.modes.ModeType');
goog.require('sia.modes.ConfirmingMode');
goog.require('sia.modes.PresettingMode');
goog.require('sia.modes.PretestingMode');
goog.require('sia.modes.SettingMode');
goog.require('sia.modes.TestingMode');
goog.require('sia.ui.AppInterface');
goog.require('sia.ui.ControlPanel');
goog.require('sia.ui.ControlPanel.EventType');
goog.require('sia.ui.Keypad.EventType');



/**
 * A class for SIA Application.
 * @constructor
 * @param {*=} opt_authenticator Autheticator is an any object has {@code
 *   a.equals(b)} method.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
sia.App = function(opt_authenticator, opt_domHelper) {
  goog.base(this);

  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

  var appInterface = this.getAppInterface();
  appInterface.decorate(goog.dom.getElement(sia.App.KEYPAD_PANEL_ID));

  var controlPanel = this.getControlPanel();
  controlPanel.decorate(goog.dom.getElement(sia.App.CONTROL_PANEL_ID));
  this.updateControlPanel();

  var handler = this.getHandler().
    listen(appInterface, sia.ui.Keypad.EventType.COMPLETE,
      this.handleComplete).
    listen(controlPanel, sia.ui.ControlPanel.EventType.START, this.handleStart);

  this.modeMap_ = new goog.structs.Map(this.mode_);
  this.setMode(this.getMode(sia.modes.ModeType.PRE_SETTING));

  if (sia.debug.LOG_ENABLED) {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
    var console = new goog.debug.Console();
    console.setCapturing(true);

    handler.listen(appInterface.getKeypad(), [
        sia.ui.Keypad.EventType.APPENDED,
        sia.ui.Keypad.EventType.REMOVED,
        sia.ui.Keypad.EventType.POPPED,
        sia.ui.Keypad.EventType.PUSHED], this.handleKeypadEvents);
  }
};
goog.inherits(sia.App, goog.events.EventTarget);


/**
 * @define {string} Element id for the application.
 */
sia.App.KEYPAD_PANEL_ID = 'sia-panel-keys';


/**
 * @define {string} Element id for the application.
 */
sia.App.CONTROL_PANEL_ID = 'sia-panel-control';


if (sia.debug.LOG_ENABLED) {
  /**
   * Logger for this application.
   * @type {goog.debug.Logger}
   * @private
   */
  sia.App.logger_ = goog.debug.LogManager.getLogger('sia');
}


/**
 * Mode map.
 * @type {goog.structs.Map}
 * @private
 */
sia.App.prototype.modeMap_;


/**
 * Current mode.
 * @type {sia.modes.Mode}
 * @private
 */
sia.App.prototype.mode_;


/**
 * Sets a mode.
 * @param {!sia.modes.Mode} mode The mode to set.
 */
sia.App.prototype.setMode = function(mode) {
  this.mode_ = mode;
};


/**
 * Returns a mode.
 * @return {!sia.modes.Mode} The mode.
 */
sia.App.prototype.getCurrentMode = function() {
  return this.mode_;
};


/**
 * Returns a mode, lazily created the first time this method is called.
 * @param {sia.modes.ModeType} modeType Mode type.
 * @return {!sia.modes.Mode} The mode.
 */
sia.App.prototype.getMode = function(modeType) {
  var map = this.modeMap_;
  var mode = map.get(modeType);
  if (!mode) {
    switch (modeType) {
      case sia.modes.ModeType.PRE_SETTING:
        map.set(modeType, mode = new sia.modes.PresettingMode(this));
        break;
      case sia.modes.ModeType.SETTING:
        map.set(modeType, mode = new sia.modes.SettingMode(this));
        break;
      case sia.modes.ModeType.PRE_TESTING:
        map.set(modeType, mode = new sia.modes.PretestingMode(this));
        break;
      case sia.modes.ModeType.TESTING:
        map.set(modeType, mode = new sia.modes.TestingMode(this));
        break;
      case sia.modes.ModeType.CONFIRMING:
        map.set(modeType, mode = new sia.modes.ConfirmingMode(this));
        break;
      default:
        goog.asserts.fail('Illegal mode type: ' + modeType);
    }
  }
  return mode;
};


/** @override */
sia.App.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.appInterface_.dispose();
  this.controlPanel_.dispose();
};


/**
 * Returns the application interface. Construct an interface if the interface
 * was not defined.
 * @return {!sia.ui.AppInterface} Interface for this application.
 * @protected
 */
sia.App.prototype.getAppInterface = function() {
  return this.appInterface_ || (this.appInterface_ =
      new sia.ui.AppInterface(this.getDomHelper()));
};


/**
 * Returns the dom helper that is being used on this component.
 * @return {!goog.dom.DomHelper} The dom helper used on this component.
 */
sia.App.prototype.getDomHelper = function() {
  return this.dom_;
};


/**
 * Returns the control panel for this application, lazily created the first
 * time this method is called.
 * @return {!sia.secrets.CombinationalSymbols} Authenticator for this
 *   application.
 * @protected
 */
sia.App.prototype.getControlPanel = function() {
  return this.controlPanel_ || (this.controlPanel_ = new sia.ui.ControlPanel(
        null, this.getDomHelper()));
};


/**
 * Returns the event handler for this component, lazily created the first time
 * this method is called.
 * @return {!goog.events.EventHandler} Event handler for this application.
 * @protected
 */
sia.App.prototype.getHandler = function() {
  return this.handler_ || (this.handler_ = new goog.events.EventHandler(this));
};


/**
 * Returns the authenticator helper for this application, lazily created the
 * first time this method is called.
 * @return {!sia.auth.AuthenticationHelper} Authentication helper for this
 *   application.
 * @protected
 */
sia.App.prototype.getAutheticationHelper = function() {
  return this.authHelper_ || (this.authHelper_ =
      new sia.auth.AuthenticationHelper(this.getAuthenticator()));
};


/**
 * Returns the authenticator for this application, lazily created the first
 * time this method is called.
 * @return {!sia.secrets.CombinationalSymbols} Authenticator for this
 *   application.
 * @protected
 */
sia.App.prototype.getAuthenticator = function() {
  return this.correct_ || (this.correct_ =
      new sia.secrets.CombinationalSymbols());
};


/**
 * Returns a new authenticator was last input.
 * @return {!sia.secrets.CombinationalSymbols} Last input.
 */
sia.App.prototype.getLastInput = function() {
  return this.lastInput_;
};


/**
 * Handles a complete event from a keypad.
 * @param {goog.events.EventTarget} e Complete event to handle.
 * @protected
 */
sia.App.prototype.handleComplete = function(e) {
  var keypad = this.getAppInterface().getKeypad();
  var authHelper = this.getAutheticationHelper();
  var symbols = keypad.getCombinationalSymbols();
  var result = this.getAutheticationHelper().authenticate(symbols);

  if (sia.debug.LOG_ENABLED) {
    sia.App.logger_.finer('Resolved: ' + symbols.toString(true));
    sia.App.logger_.fine('Result: ' + (result ? 'Success' : 'Failed'));
  }

  this.lastInput_ = symbols.clone();
  this.getCurrentMode().next();
};


/**
 * Updates a control panel.
 */
sia.App.prototype.updateControlPanel = function() {
  var keypad = this.getAppInterface().getKeypad();
  var authHelper = this.getAutheticationHelper();
  var symbols = keypad.getCombinationalSymbols();
  var controlPanel = this.getControlPanel();
  controlPanel.setCorrectAnswer(authHelper.getCorrect());
  controlPanel.setLastAnswer(symbols);
};


/**
 * Handles an appended event from a keypad.
 * @param {goog.events.EventTarget} e Appended event to handle.
 * @protected
 */
sia.App.prototype.handleKeypadEvents = function(e) {
  var keypad = this.getAppInterface().getKeypad();
  if (sia.debug.LOG_ENABLED) {
    sia.App.logger_.finer('Update: ' + keypad.getCombinationalSymbols());
  }
};


/**
 * Handles a start event from a control panel.
 * @param {goog.events.EventTarget} e Start event to handle.
 * @protected
 */
sia.App.prototype.handleStart = function(e) {
  this.getCurrentMode().next();
};
