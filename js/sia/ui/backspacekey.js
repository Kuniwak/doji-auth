// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a backspace key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.BackspaceKey');
goog.provide('sia.ui.BackspaceKeyRenderer');

goog.require('goog.events.KeyCodes');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');
goog.require('sia.ui.Key');



/**
 * A class for a virtual symbol key for the SIA.
 *
 * @constructor
 * @extends {sia.ui.SymbolKey}
 *
 * @param {sia.ui.BackspaceKeyRenderer=} opt_renderer Renderer used to
 *   render or decorate the numerical key; defaults to
 *   {@link sia.ui.BackspaceKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.BackspaceKey = function(opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || new sia.ui.BackspaceKeyRenderer(),
			opt_domHelper);

	this.keyCode_ = goog.events.KeyCodes.BACKSPACE;
};
goog.inherits(sia.ui.BackspaceKey, sia.ui.Key);


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.BackspaceKey.CSS_CLASS = goog.getCssName('sia-backspace-key');


/** @override */
sia.ui.BackspaceKey.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var parent = this.getParent();
	this.setEnabled(parent.getActiveSymbolKeyCount() <= 0 &&
			parent.getCombinationalSymbols().getCount() > 0);

	this.getHandler().listen(this.getParent(), [
		sia.ui.Keypad.EventType.PUSHED,
		sia.ui.Keypad.EventType.POPPED], this.handleChangeSymbolsCount);
};


/** @override */
sia.ui.BackspaceKey.prototype.getKeyCode = function() {
	return this.keyCode_;
};


/** @override */
sia.ui.BackspaceKey.prototype.handlePostactivate = function(e) {
	var parent = this.getParent();
	if (parent) {
		goog.array.forEach(parent.getSymbolKeys(), function(key) {
			key.setEnabled(false);
		});
	}
};


/** @override */
sia.ui.BackspaceKey.prototype.handlePostdeactivate = function(e) {
	var parent = this.getParent();
	if (parent) {
		console.log(this.isActive(), this.isEnabled());
		parent.popAppendedSymbols();
		goog.array.forEach(parent.getSymbolKeys(), function(key) {
			key.setEnabled(true);
		});
	}
};


/** @override */
sia.ui.BackspaceKey.prototype.handleChangeSymbolsCount = function(e) {
	var parent = this.getParent();

	// The reason why the count of active keys are compared to 1 is the symbol
	// key is active yet when the #handleChangeSymbolsCount was done.
	var enable = parent.getActiveSymbolKeyCount() <= 0 &&
			parent.getCombinationalSymbols().getCount() > 0;

	if (enable) {
		this.setEnabled(enable);
	}
	else {
		// Avoid a call stack overflow. #setEnabled(false) fires a deactivate event,
		// and #handlePostdeactivate fires popped events. So, the symbol key have to be
		// disabled before calling #setEnabled(false) on #handleChangeSymbolsCount.
		//this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, false);
		this.setEnabled(enable);
		//this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, true);
	}
};



/**
 * A class for a function key renderer for the SIA.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
sia.ui.BackspaceKeyRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.BackspaceKeyRenderer, goog.ui.ButtonRenderer);
goog.ui.registry.setDefaultRenderer(sia.ui.BackspaceKey,
		function() { return new sia.ui.BackspaceKeyRenderer(); });


/** @override */
sia.ui.BackspaceKeyRenderer.prototype.getCssClass = function() {
	return sia.ui.BackspaceKey.CSS_CLASS;
};
