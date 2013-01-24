// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.SymbolKey');
goog.provide('sia.ui.SymbolKey.EventType');
goog.provide('sia.ui.SymbolKeyRenderer');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.functions');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');



/**
 * A class for a numerical key for the SIA.
 *
 * @constructor
 * @extends {goog.ui.Button}
 *
 * @param {string} symbol The symbol of the key.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
 *   decorate the numerical key; defaults to {@link sia.ui.ButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.SymbolKey = function(symbol, opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer, opt_domHelper);

	this.symbol_ = symbol;
};
goog.inherits(sia.ui.SymbolKey, goog.ui.Button);


/**
 * Common events fired by numeric key.
 * @enum {string}
 */
sia.ui.SymbolKey.EventType = {
	POSTACTION: 'postaction',
	PREACTION: 'preaction'
};


/**
 * Whether the key is pressed.
 * @private
 * @type {boolean}
 */
sia.ui.SymbolKey.prototype.isKeyPressed_ = false;


/**
 * Returns a symbol of the key.
 * @return {?string} The symbol.
 */
sia.ui.SymbolKey.prototype.getSymbol = function() {
	return this.symbol_;
};


/**
 * Sets a combinational symbols.
 * @param {sia.secrets.CombinationalSymbols} symbols The combinational symbols.
 */
sia.ui.SymbolKey.prototype.setCombinationalSymbols = function(symbols) {
	this.combinationalSymbols_ = symbols;
};


/**
 * Returns a combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} The combinational symbols.
 */
sia.ui.SymbolKey.prototype.getCombinationalSymbols = function() {
	return this.combinationalSymbols_;
};


/**
 * Returns a key code of the key.
 * @return {?number} The key code.
 */
sia.ui.SymbolKey.prototype.getKeyCode = function() {
	return null;
};


/** @override */
sia.ui.SymbolKey.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var handler = this.getHandler();

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.SymbolKey.EventType.PREACTION,
			/* func */ this.handlePreaction);

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.SymbolKey.EventType.POSTACTION,
			/* func */ this.handlePostaction);

	//TODO: Adapt IE and Older Webkit
	handler.listen(
			/* src  */ this.getDomHelper().getDocument(),
			/* type */ goog.events.EventType.KEYDOWN,
			/* func */ this.handleKeydown);

	//TODO: Adapt IE and Older Webkit
	handler.listen(
			/* src  */ this.getDomHelper().getDocument(),
			/* type */ goog.events.EventType.KEYUP,
			/* func */ this.handleKeyup);
};


/** @override */
sia.ui.SymbolKey.prototype.handleMouseDown = goog.nullFunction;


/** @override */
sia.ui.SymbolKey.prototype.handleMouseUp = goog.nullFunction;


/** @override */
sia.ui.SymbolKey.prototype.handleMouseMove = goog.nullFunction;


/**
 * Handles a keyup event.
 * @protected
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.SymbolKey.prototype.handleKeydown = function(e) {
	if (this.isEnabled() &&
			this.isAutoState(goog.ui.Component.State.ACTIVE) &&
			!this.isKeyPressed_ && this.getKeyCode() === e.keyCode) {
		var preactionEvent = new goog.events.Event(
				sia.ui.SymbolKey.EventType.PREACTION, this);
		this.setActive(true);
		this.isKeyPressed_ = true;
		this.dispatchEvent(preactionEvent);
	}
};


/**
 * Handles a keyup event.
 * @protected
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.SymbolKey.prototype.handleKeyup = function(e) {
	if (this.isEnabled() && this.isActive() &&
			this.performActionInternal(e) &&
			this.isAutoState(goog.ui.Component.State.ACTIVE) &&
			this.getKeyCode() === e.keyCode) {
		var postactionEvent = new goog.events.Event(
				sia.ui.SymbolKey.EventType.POSTACTION, this);
		this.setActive(false);
		this.dispatchEvent(postactionEvent);
	}
	this.isKeyPressed_ = false;
};


/** @override */
sia.ui.SymbolKey.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles a preaction event.
 * @protected
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.SymbolKey.prototype.handlePreaction = function(e) {
	var symbols = this.getCombinationalSymbols();
	symbols.append(this.getSymbol());
};


/**
 * Handles a postaction event.
 * @protected
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.SymbolKey.prototype.handlePostaction = function(e) {
	//var symbols = this.getCombinationalSymbols();
	//symbols.remove(this.getSymbol());
};
