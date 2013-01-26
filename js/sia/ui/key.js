// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.Key');
goog.provide('sia.ui.Key.EventType');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.functions');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('sia.events.KeyEdgeTriggerHandler');
goog.require('sia.events.KeyEdgeTriggerHandler.EventType');



/**
 * A class for a numerical key for the SIA.
 *
 * @constructor
 * @extends {goog.ui.Button}
 *
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
 *   decorate the numerical key; defaults to {@link sia.ui.ButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.Key = function(opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer, opt_domHelper);

	this.keyEdgeTriggerHandler_ = new sia.events.KeyEdgeTriggerHandler();
};
goog.inherits(sia.ui.Key, goog.ui.Button);


/**
 * Common events fired by numeric key.
 * @enum {string}
 */
sia.ui.Key.EventType = {
	POSTACTION: 'postaction',
	PREACTION: 'preaction'
};


/**
 * Whether the key is pressed.
 * @private
 * @type {boolean}
 */
sia.ui.Key.prototype.isKeyPressed_ = false;


/**
 * Returns a symbol of the key.
 * @return {?string} The symbol.
 */
sia.ui.Key.prototype.getSymbol = function() {
	return this.symbol_;
};


/**
 * Returns a key code of the key.
 * @return {?number} The key code.
 */
sia.ui.Key.prototype.getKeyCode = function() {
	return null;
};


/** @override */
sia.ui.Key.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	// TODO: Switch to goog.ui.Component.EventType.ACTIVATE/DEACTIVATE.
	var handler = this.getHandler();
	var keyHandler = this.keyEdgeTriggerHandler_;
	keyHandler.attach(this.getDomHelper().getDocument());

	this.getHandler().
		listen(this, sia.ui.Key.EventType.PREACTION, this.handlePreaction).
		listen(this, sia.ui.Key.EventType.POSTACTION, this.handlePostaction).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE,
				this.handleKeydown).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE,
				this.handleKeyup);
};


/** @override */
sia.ui.Key.prototype.handleMouseDown = goog.nullFunction;


/** @override */
sia.ui.Key.prototype.handleMouseUp = goog.nullFunction;


/** @override */
sia.ui.Key.prototype.handleMouseMove = goog.nullFunction;


/**
 * Handles a keyup event.
 * @protected
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.Key.prototype.handleKeydown = function(e) {
	if (this.getKeyCode() === e.keyCode) {
		if (!this.isKeyPressed_) {
			if (this.isEnabled() &&
					this.isAutoState(goog.ui.Component.State.ACTIVE)) {
				this.setActive(true);
				this.dispatchEvent(sia.ui.Key.EventType.PREACTION);
			}
			this.isKeyPressed_ = true;
		}
		e.preventDefault();
	}
};


/**
 * Handles a keyup event.
 * @protected
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.Key.prototype.handleKeyup = function(e) {
	if (this.getKeyCode() === e.keyCode) {
		if (this.isKeyPressed_) {
			if (this.isEnabled() && this.isActive() &&
					this.performActionInternal(e) &&
					this.isAutoState(goog.ui.Component.State.ACTIVE)) {
				this.setActive(false);
				this.dispatchEvent(sia.ui.Key.EventType.POSTACTION);
			}
			this.isKeyPressed_ = false;
		}
		e.preventDefault();
	}
};


/** @override */
sia.ui.Key.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles a preaction event.
 * @protected
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.Key.prototype.handlePreaction = goog.nullFunction;


/**
 * Handles a postaction event.
 * @protected
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.Key.prototype.handlePostaction = goog.nullFunction;
