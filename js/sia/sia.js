// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for SIA (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia');
goog.provide('sia.App');

goog.require('goog.debug.Console');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.ui.Component');
goog.require('sia.auth.AuthenticationHelper');
goog.require('sia.ui.AppInterface');



/**
 * A class for SIA Application.
 * @constructor
 * @param {*=} opt_authenticator Autheticator is an any object has {@code
 *   a.equals(b)}
 *   method.
 */
sia.App = function(opt_authenticator) {
	goog.base(this);

	var appInterface = this.getAppInterface();
	appInterface.decorate(goog.dom.getElement(sia.App.ELEMENT_ID));

	var handler = this.getHandler();
	handler.listen(appInterface, sia.ui.Keypad.EventType.COMPLETE,
			this.handleComplete);

	if (sia.App.LOG_ENABLED) {
		goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
		this.logger_ = goog.debug.LogManager.getLogger('sia');
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
 * @define {boolean} Whether a logger is enabled.
 */
sia.App.LOG_ENABLED = true;


/**
 * @define {string} Element id for the application.
 */
sia.App.ELEMENT_ID = 'sia-keys';


/**
 * Default authenticator is (1, 2, 3), 5.
 * The bracket means simulataneous input.
 * @const
 * @type {sia.secrets.CombinationalSymbols}
 */
sia.App.DEFAULT_AUTHENTICATOR = new sia.secrets.CombinationalSymbols();
sia.App.DEFAULT_AUTHENTICATOR.append('1');
sia.App.DEFAULT_AUTHENTICATOR.append('2');
sia.App.DEFAULT_AUTHENTICATOR.append('3');
sia.App.DEFAULT_AUTHENTICATOR.push();
sia.App.DEFAULT_AUTHENTICATOR.append('5');


/**
 * Returns the application interface. Construct an interface if the interface
 * was not defined.
 * @return {!sia.ui.AppInterface} Interface for this application.
 * @protected
 */
sia.App.prototype.getAppInterface = function() {
	return this.appInterface_ || (this.appInterface_ =
			new sia.ui.AppInterface());
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
 * @return {!sia.auth.AuthenticationHelper} The authenticator for this
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
 * @return {!sia.secrets.CombinationalSymbols} The authenticator for this
 *   application.
 * @protected
 */
sia.App.prototype.getAuthenticator = function() {
	return this.authHelper_ || (this.authHelper_ = sia.App.DEFAULT_AUTHENTICATOR);
};


/**
 * Handles a complete event from a keypad.
 * @param {goog.events.EventTarget} e Complete event to handle.
 * @protected
 */
sia.App.prototype.handleComplete = function(e) {
	var keypad = this.getAppInterface().getKeypad();
	var result = this.getAutheticationHelper().authenticate(
			keypad.getCombinationalSymbols());

	if (sia.App.LOG_ENABLED) {
		var selializable = keypad.getCombinationalSymbols().toSerializable(true);
		this.logger_.finer('Resolved: ' + goog.json.serialize(selializable));
		this.logger_.fine('Result: ' + (result ? 'Success' : 'Failed'));
	}
};


/**
 * Handles an appended event from a keypad.
 * @param {goog.events.EventTarget} e Appended event to handle.
 * @protected
 */
sia.App.prototype.handleKeypadEvents = function(e) {
	var keypad = this.getAppInterface().getKeypad();
	var EventType = sia.ui.Keypad.EventType;
	var prefix;

	switch (e.type) {
		case EventType.APPENDED:
			prefix = 'Appended';
			break;
		case EventType.REMOVED:
			prefix = 'Removed';
			break;
		case EventType.PUSHED:
			prefix = 'Pushed';
			break;
		case EventType.POPPED:
			prefix = 'Popped';
			break;
	}
	this.logger_.finer(prefix + ': ' + keypad.getCombinationalSymbols());
};


/**
 * The application instance.
 * @type {sia.App}
 */
sia.app = new sia.App();
