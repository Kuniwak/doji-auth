// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.Key');
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
 *   decorate the numerical key; defaults to {@link sia.ui.KeyRenderer}.
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

	var element = this.getElement();
	var handler = this.getHandler();
	var keyHandler = this.keyEdgeTriggerHandler_;
	keyHandler.attach(this.getDomHelper().getDocument());

	this.getHandler().
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE,
				this.handleKeyFallingEgde).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE,
				this.handleKeyRisingEgde);
};


/** @override */
sia.ui.Key.prototype.setState = function(state, enable) {
	var changed = enable !== this.hasState(state) &&
		state & goog.ui.Component.State.ACTIVE;
	goog.base(this, 'setState', state, enable);
	if (changed) {
		if (enable) {
			this.handleActivated();
		}
		else {
			this.handleDeactivated();
		}
	}
};


/**
 * Handles key {@link sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE}.
 * Set this key active, if an event target is this key.
 * @param {goog.events.KeyEvent} e Key event to handle.
 */
sia.ui.Key.prototype.handleKeyFallingEgde = function(e) {
	if (e.keyCode === this.getKeyCode()) {
		this.setActive(true);
		e.getBrowserEvent().preventDefault();
	}
};


/**
 * Handles key {@link sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE}.
 * Set this key active, if an event target is this key.
 * @param {goog.events.KeyEvent} e Key event to handle.
 */
sia.ui.Key.prototype.handleKeyRisingEgde = function(e) {
	if (e.keyCode === this.getKeyCode()) {
		this.setActive(false);
		e.getBrowserEvent().preventDefault();
	}
};


/** @override */
sia.ui.Key.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles an activated event.
 * @protected
 */
sia.ui.Key.prototype.handleActivated = goog.nullFunction;


/**
 * Handles a deactivated event.
 * @protected
 */
sia.ui.Key.prototype.handleDeactivated = goog.nullFunction;
