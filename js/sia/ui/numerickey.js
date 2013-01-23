// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.NumericalKey');
goog.provide('sia.ui.NumericalKey.EventType');
goog.provide('sia.ui.NumericalKeyRenderer');
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
	this.combinationalSymbols_ = combiNum;
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
goog.ui.registry.setDecoratorByClassName(sia.ui.NumericalKey.CSS_CLASS,
		sia.ui.NumericalKey);


/**
 * Whether the key is pressed.
 * @private
 * @type {boolean}
 */
sia.ui.NumericalKey.prototype.isKeyPressed_ = false;


/** @override */
sia.ui.NumericalKey.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var handler = this.getHandler();

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.NumericalKey.EventType.PREACTION,
			/* func */ this.handlePreaction);

	handler.listen(
			/* src  */ this,
			/* type */ sia.ui.NumericalKey.EventType.POSTACTION,
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
sia.ui.NumericalKey.prototype.handleMouseDown = goog.nullFunction;


/** @override */
sia.ui.NumericalKey.prototype.handleMouseUp = goog.nullFunction;


/** @override */
sia.ui.NumericalKey.prototype.handleMouseMove = goog.nullFunction;


/**
 * Handles a keyup event.
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.NumericalKey.prototype.handleKeydown = function(e) {
	if (this.isEnabled() &&
			this.isAutoState(goog.ui.Component.State.ACTIVE) &&
			!this.isKeyPressed_ && this.keyCode_ === e.keyCode) {
		var preactionEvent = new goog.events.Event(
				sia.ui.NumericalKey.EventType.PREACTION, this);
		this.setActive(true);
		this.isKeyPressed_ = true;
		this.dispatchEvent(preactionEvent);
	}
};


/**
 * Handles a keyup event.
 * @param {?goog.events.Event} e Keyup event to handle.
 */
sia.ui.NumericalKey.prototype.handleKeyup = function(e) {
	if (this.isEnabled() && this.isActive() &&
			this.performActionInternal(e) &&
			this.isAutoState(goog.ui.Component.State.ACTIVE) &&
			this.keyCode_ === e.keyCode) {
		var postactionEvent = new goog.events.Event(
				sia.ui.NumericalKey.EventType.POSTACTION, this);
		this.setActive(false);
		this.dispatchEvent(postactionEvent);
	}
	this.isKeyPressed_ = false;
};


/** @override */
sia.ui.NumericalKey.prototype.handleKeyEventInternal = goog.functions.FALSE;


/**
 * Handles a preaction event.
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.NumericalKey.prototype.handlePreaction = function(e) {
	this.combinationalSymbols_.append(this.number_);
};


/**
 * Handles a postaction event.
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.NumericalKey.prototype.handlePostaction = function(e) {
	//this.combinationalSymbols_.remove(this.number_);
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
