// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The key event handler for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.events.KeyEdgeTriggerHandler');
goog.provide('sia.events.KeyEdgeTriggerHandler.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');



/**
 * A wrapper around an element that you want to listen to keyboard events on.
 * @param {Element|Document=} opt_element The element or document to listen on.
 * @param {boolean=} opt_capture Whether to listen for browser events in
 *     capture phase (defaults to false).
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sia.events.KeyEdgeTriggerHandler = function(opt_element, opt_capture) {
	goog.base(this);

	this.keyHandler_ = new goog.events.KeyHandler(opt_element, opt_capture);
	this.handler_ = new goog.events.EventHandler(this);
};
goog.inherits(sia.events.KeyEdgeTriggerHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
sia.events.KeyEdgeTriggerHandler.EventType = {
	/**
	 * Key falling edge event. The event will be fired when a keydown event was
	 * fired first on an attached element.
	 */
	FALLING_EDGE: 'keyfallingedge',
	/**
	 * Key rising edge event. The event will be fired when a keyup event was
	 * fired first on an attached element.
	 */
	RISING_EDGE: 'keyrisingedge'
};


/** @override */
sia.events.KeyEdgeTriggerHandler.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
	this.keyHandler_.dispose();
	this.handler_.dispose();
};


/**
 * Adds the proper key event listeners to the element.
 * @param {Element|Document} element The element to listen on.
 * @param {boolean=} opt_capture Whether to listen for browser events in
 *     capture phase (defaults to false).
 */
sia.events.KeyEdgeTriggerHandler.prototype.attach = function(element,
		opt_capture) {
	this.keyHandler_.attach(element, opt_capture);
	this.handler_.
		listen(element, goog.events.EventType.KEYUP, this.handleKeyup_,
				opt_capture).
		listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY,
				this.handleKey_, opt_capture);
};


/**
 * Removes the listeners that may exist.
 */
sia.events.KeyEdgeTriggerHandler.prototype.detach = function() {
	this.handler_.removeAll();
};


/**
 * Returns the element listened on for the real keyboard events.
 * @return {Element|Document|null} The element listened on for the real
 *     keyboard events.
 */
sia.events.KeyEdgeTriggerHandler.prototype.getElement = function() {
	return this.keyHandler_.getElement();
};


/**
 * Handles a keyup event.
 * @param {goog.events.BrowserEvent} e The key down event.
 * @private
 */
sia.events.KeyEdgeTriggerHandler.prototype.handleKeyup_ = function(e) {
	var keyEvent = new goog.events.KeyEvent(e.keyCode, e.charCode, false,
			e.getBrowserEvent());
	keyEvent.type = sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE;
	this.dispatchEvent(keyEvent);
};


/**
 * Handles a key event.
 * @param {goog.events.BrowserEvent} e The key down event.
 * @private
 */
sia.events.KeyEdgeTriggerHandler.prototype.handleKey_ = function(e) {
	if (!e.repeat) {
		var keyEvent = new goog.events.KeyEvent(e.keyCode, e.charCode, false,
				e.getBrowserEvent());
	keyEvent.type = sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE;
		this.dispatchEvent(keyEvent);
	}
};
