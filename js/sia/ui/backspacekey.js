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
sia.ui.BackspaceKey.prototype.getKeyCode = function() {
	return this.keyCode_;
};


/** @override */
sia.ui.BackspaceKey.prototype.handleActivate = function(e) {
	var parent = this.getParent();
	if (parent) {
		parent.setInactiveSymbolKeysEnabled(false);
	}
};


/** @override */
sia.ui.BackspaceKey.prototype.handleDeactivate = function(e) {
	var parent = this.getParent();
	if (parent) {
		if (parent.getCombinationalSymbols().getCount() <= 0) {
			parent.setBackspaceKeyEnabled(false);
		}
		parent.getCombinationalSymbols().pop();
		parent.setInactiveSymbolKeysEnabled(true);
		parent.update();
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
		sia.ui.BackspaceKeyRenderer);


/** @override */
sia.ui.BackspaceKeyRenderer.prototype.getCssClass = function() {
	return sia.ui.BackspaceKey.CSS_CLASS;
};
