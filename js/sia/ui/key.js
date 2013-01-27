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

	this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, true);
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
 * Returns a key code of the key.
 * @return {?number} The key code.
 */
sia.ui.Key.prototype.getKeyCode = function() {
	return null;
};


/** @override */
sia.ui.Key.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var handler = this.getHandler();
	var keyHandler = this.keyEdgeTriggerHandler_;
	keyHandler.attach(this.getDomHelper().getDocument());

	this.getHandler().
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE,
				this.handleKeydown).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE,
				this.handleKeyup);
};


/** @override */
sia.ui.Key.prototype.setState = function(state, enable) {
	var changed = enable !== this.hasState(state) &&
		state & goog.ui.Component.State.ACTIVE;
	goog.base(this, 'setState', state, enable);
	if (changed) {
		if (enable) {
			this.handlePostactivate();
		}
		else {
			this.handlePostdeactivate();
		}
	}
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
 * @param {?goog.events.Event} e Activate event to handle.
 */
sia.ui.Key.prototype.handlePostactivate = goog.nullFunction;


/**
 * Handles a postaction event.
 * @protected
 * @param {?goog.events.Event} e Deactivate event to handle.
 */
sia.ui.Key.prototype.handlePostdeactivate = goog.nullFunction;


/**
 * Handles a update event.
 * @protected
 * @param {?goog.events.Event} e Update event to handle from a parent Keypad.
 */
sia.ui.Key.prototype.handleUpdate = goog.nullFunction;
