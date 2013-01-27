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


/** @override */
sia.ui.SymbolKey.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var parent = this.getParent();
	this.getHandler().listen(parent, [
			sia.ui.Keypad.EventType.APPENDED,
			sia.ui.Keypad.EventType.REMOVED,
			sia.ui.Keypad.EventType.POPPED], this.handleChangeSymbolsCount);
};


/**
 * Returns a symbol of the key.
 * @return {?string} The symbol.
 */
sia.ui.SymbolKey.prototype.getSymbol = function() {
	return this.symbol_;
};


/** @override */
sia.ui.SymbolKey.prototype.handleChangeSymbolsCount = function(e) {
	var parent = this.getParent();
	var enable = parent.getCombinationalSymbols().getCount() <
			sia.secrets.CombinationalSymbols.MAX_COUNT;
	this.setEnabled(enable);
};


/** @override */
sia.ui.SymbolKey.prototype.handlePostactivate = function(e) {
	var parent = this.getParent();

	if (parent) {
		var symbol = this.getSymbol();
		parent.clearTimeout();
		parent.appendSymbol(symbol);
		parent.setSymbolKeyActive(symbol, true);
	}
};


/** @override */
sia.ui.SymbolKey.prototype.handlePostdeactivate = function(e) {
	var parent = this.getParent();

	if (parent) {
		parent.setSymbolKeyActive(this.getSymbol(), false);
		if (parent.getActiveSymbolKeyCount() <= 0) {
			parent.clearTimeout();
			parent.pushAppendedSymbols();
		}
		else {
			parent.setTimeout();
		}
	}
};
