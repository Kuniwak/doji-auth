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


/** @override */
sia.ui.Key.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
	this.keyEdgeTriggerHandler_.dispose();
};


/**
 * Returns a combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} The combinational symbols.
 * @deprecated Use getParent().getCombinationalSymbols().
 */
sia.ui.Key.prototype.getCombinationalSymbols = function() {
	var parent = this.getParent();
	return parent && parent.getCombinationalSymbols();
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

	var keyHandler = this.keyEdgeTriggerHandler_;
	keyHandler.attach(this.getDomHelper().getDocument());

	this.getHandler().
		listen(this, goog.ui.Component.EventType.ACTIVATE,
			this.handleActivate).
		listen(this, goog.ui.Component.EventType.DEACTIVATE,
			this.handleDeactivate).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.FALLING_EDGE,
			this.handleKeyFallingEgde).
		listen(keyHandler, sia.events.KeyEdgeTriggerHandler.EventType.RISING_EDGE,
			this.handleKeyRisingEgde);
};


/**
 * Handles key falling edge event. Set an active state, if the event target is
 * the element.
 */
sia.ui.Key.prototype.handleKeyFallingEgde = function(e) {
	if (this.isEnabled() && e.keyCode === this.getKeyCode()) {
		this.setActive(true);
	}
	e.getBrowserEvent().preventDefault();
};


/**
 * Handles key rising edge event. Set an inactive state, if the event target is
 * the element.
 */
sia.ui.Key.prototype.handleKeyRisingEgde = function(e) {
	if (this.isEnabled() && e.keyCode === this.getKeyCode()) {
		this.setActive(false);
	}
	e.getBrowserEvent().preventDefault();
};


/** @override */
sia.ui.Key.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles a preaction event.
 * @protected
 * @param {?goog.events.Event} e Activate event to handle.
 */
sia.ui.Key.prototype.handleActivate = goog.nullFunction;


/**
 * Handles a postaction event.
 * @protected
 * @param {?goog.events.Event} e Deactivate event to handle.
 */
sia.ui.Key.prototype.handleDeactivate = goog.nullFunction;
