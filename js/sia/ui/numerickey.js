// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.NumericalKey');
goog.provide('sia.ui.NumericalKeyRenderer');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.functions');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');



/**
 * A class for a numerical key for the SIA.
 *
 * @constructor
 * @extends {goog.ui.Button}
 *
 * @param {number} number The number of the key.
 * @param {sia.secrets.CombinationalSymbols} combiNum The comnational numbers.
 * @param {sia.ui.NumericalKeyRenderer=} opt_renderer Renderer used to
 *		 render or decorate the numerical key; defaults to
 *		 {@link sia.ui.NumericalKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *		 interaction.
 */
sia.ui.NumericalKey = function(number, combiNum, opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer || new sia.ui.NumericalKeyRenderer(),
			opt_domHelper);

	this.number_ = number;
	this.keyCode_ = number + goog.events.KeyCodes.ZERO;
	this.combinationalNumbers_ = combiNum;
};
goog.inherits(sia.ui.NumericalKey, goog.ui.Button);


/**
 * Common events fired by numeric key.
 * @enum {string}
 */
sia.ui.NumericalKey.EventType = {
	POSTACTION: 'postaction',
	PREACTION: 'preaction'
};


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.NumericalKey.CSS_CLASS = goog.getCssName('sia-button');


/** @override */
sia.ui.NumericalKey.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var target = this.getKeyEventTarget();
	var handler = this.getHandler();

	handler.listen(
			/* src  */ this,
			/* type */ goog.ui.Component.EventType.ACTION,
			/* func */ this.handleAction);

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.NumericalKey.EventType.PREACTION,
			/* func */ this.handlePreaction);

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.NumericalKey.EventType.POSTACTION,
			/* func */ this.handlePostaction);

	handler.listen(
			/* src  */ target,
			/* type */ goog.events.EventType.KEYDOWN,
			/* func */ this.handleKeydown);

	handler.listen(
			/* src  */ target,
			/* type */ goog.events.EventType.KEYUP,
			/* func */ this.handleKeyup);
};


/**
 * Handles a keyup event.
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.NumericalKey.prototype.handleKeydown = function(e) {
	console.log(e);
	if (this.isEnabled()) {
		if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
			var preactionEvent = new goog.events.Event(
					sia.ui.NumericalKey.EventType.PREACTION, this);
			this.setActive(true);
			this.dispatchEvent(preactionEvent);
		}
	}
};


/**
 * Handles a keyup event.
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.NumericalKey.prototype.handleKeyup = function(e) {
	console.log(e);
	if (this.isEnabled()) {
		if (this.isActive() && this.performActionInternal(e) &&
				this.isAutoState(goog.ui.Component.State.ACTIVE)) {
			var postactionEvent = new goog.events.Event(
					sia.ui.NumericalKey.EventType.POSTACTION, this);
			this.setActive(false);
			this.dispatchEvent(preactionEvent);
		}
	}
};


/** @override */
sia.ui.NumericalKey.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles an action event.
 * @param {?goog.events.Event} e Activate event to handle.
 */
sia.ui.NumericalKey.prototype.handleAction = function(e) {
	var event = new goog.events.Event(sia.ui.NumericalKey.EventType.POSTACTION,
			this);

	this.dispatchEvent(event);
};


/**
 * Handles a preaction event.
 * @param {?goog.events.Event} e Activate event to handle.
 */
sia.ui.NumericalKey.prototype.handlePreaction = function(e) {
	console.log(e);
	this.combinationalNumbers_.append(this.number_);
};


/**
 * Handles a postaction event.
 * @param {?goog.events.Event} e Deactivate event to handle.
 */
sia.ui.NumericalKey.prototype.handlePostaction = function(e) {
	console.log(e);
	this.combinationalNumbers_.remove(this.number_);
};


/**
 * A class for a numerical key renderer for the SIA.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
sia.ui.NumericalKeyRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.NumericalKeyRenderer, goog.ui.ButtonRenderer);
goog.ui.registry.setDefaultRenderer(sia.ui.NumericalKey,
		sia.ui.NumericalKeyRenderer);


/**
 * Returns a string of the number.
 * @return {string} The string of the number.
 */
sia.ui.NumericalKey.prototype.getNumber = function() {
	return this.num_;
};


/** @override */
sia.ui.NumericalKeyRenderer.prototype.getCssClass = function() {
	return sia.ui.NumericalKey.CSS_CLASS;
};
