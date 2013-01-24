// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.SymbolKey');

goog.require('sia.ui.Key');



/**
 * A class for a numerical key for the SIA.
 *
 * @constructor
 * @extends {sia.ui.Key}
 *
 * @param {string} symbol The symbol of the key.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
 *   decorate the numerical key; defaults to {@link sia.ui.ButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.SymbolKey = function(symbol, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer, opt_domHelper);

	this.symbol_ = symbol;
};
goog.inherits(sia.ui.SymbolKey, sia.ui.Key);


/**
 * Returns a symbol of the key.
 * @return {?string} The symbol.
 */
sia.ui.SymbolKey.prototype.getSymbol = function() {
	return this.symbol_;
};


/** @override */
sia.ui.SymbolKey.prototype.handlePreaction = function(e) {
	var parent = this.getParent();

	if (parent) {
		parent.setBackspaceKeyEnabled(false);
		var symbols = this.getCombinationalSymbols();
		symbols.append(this.getSymbol());
		parent.incrementAvtiveKeyCount();
	}
};


/** @override */
sia.ui.SymbolKey.prototype.handlePostaction = function() {
	var parent = this.getParent();

	if (parent) {
		parent.decrementAvtiveKeyCount();
	}
};
