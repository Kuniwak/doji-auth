// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a virtual symbol key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.VirtualSymbolKey');
goog.provide('sia.ui.VirtualSymbolKeyRenderer');
goog.require('goog.events.KeyCodes');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secrets.VirtualSymbol');
goog.require('sia.ui.SymbolKey');



/**
 * A class for a virtual symbol key for the SIA.
 *
 * @constructor
 * @extends {sia.ui.SymbolKey}
 *
 * @param {sia.secrets.VirtualSymbol} symbol The number string of the key.
 * @param {sia.ui.NumericalKeyRenderer=} opt_renderer Renderer used to
 *   render or decorate the numerical key; defaults to
 *   {@link sia.ui.NumericalKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.VirtualSymbolKey = function(symbol, opt_renderer, opt_domHelper) {
	goog.base(this, symbol, opt_renderer ||
			new sia.ui.VirtualSymbolKeyRenderer(), opt_domHelper);

	var keyCode;
	switch (symbol) {
		case sia.secrets.VirtualSymbol.LARGE:
			keyCode = goog.events.KeyCodes.L;
			break;
		case sia.secrets.VirtualSymbol.MEDIUM:
			keyCode = goog.events.KeyCodes.M;
			break;
		case sia.secrets.VirtualSymbol.SMALL:
			keyCode = goog.events.KeyCodes.S;
			break;
	}
	this.keyCode_ = keyCode;
};
goog.inherits(sia.ui.VirtualSymbolKey, sia.ui.SymbolKey);


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.VirtualSymbolKey.CSS_CLASS = goog.getCssName('sia-virtual-symbol-key');


/** @override */
sia.ui.VirtualSymbolKey.prototype.getKeyCode = function() {
	return this.keyCode_;
};



/**
 * A class for a function key renderer for the SIA.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
sia.ui.VirtualSymbolKeyRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.VirtualSymbolKeyRenderer, goog.ui.ButtonRenderer);
goog.ui.registry.setDefaultRenderer(sia.ui.VirtualSymbolKey,
		sia.ui.VirtualSymbolKeyRenderer);


/** @override */
sia.ui.VirtualSymbolKeyRenderer.prototype.getCssClass = function() {
	return sia.ui.VirtualSymbolKey.CSS_CLASS;
};
