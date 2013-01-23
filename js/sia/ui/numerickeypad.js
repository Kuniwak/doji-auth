// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric keypad for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.NumericalKeypad');
goog.provide('sia.ui.NumericalKeypadRenderer');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.structs');
goog.require('goog.ui.Component');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secret.CombinationalSymbols');
goog.require('sia.ui.FunctionKey');
goog.require('sia.ui.NumericalKey');



/**
 * A class for Numerical keypad for SIA.
 *
 * @constructor
 * @extends {goog.ui.Container}
 * @param {goog.ui.NumericalKeypadRenderer=} opt_renderer Renderer used to
 *     render or decorate the container; defaults to
 *     {@link goog.ui.ContainerRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 */
sia.ui.NumericalKeypad = function(opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer || new sia.ui.NumericalKeypadRenderer(),
			opt_domHelper);

	this.combinationalNumbers_ = new sia.secret.CombinationalSymbols();

	this.addEventListener(
			/* type */ goog.ui.Component.EventType.ACTIVATE,
			/* func */ this.handleActivate,
			/* capt */ false,
			/* this */ this);

	this.addEventListener(
			/* type */ goog.ui.Component.EventType.DEACTIVATE,
			/* func */ this.handleDeactivate,
			/* capt */ false,
			/* this */ this);
};
goog.inherits(sia.ui.NumericalKeypad, goog.ui.Container);

sia.ui.NumericalKeypad.ID_MAP = new goog.structs.Map();


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.NumericalKeypad.CSS_CLASS = goog.getCssName('sia-buttons');
goog.ui.registry.setDecoratorByClassName(sia.ui.NumericalKeypad.CSS_CLASS,
		sia.ui.NumericalKeypad);


/**
 * A count of acivated keys.
 * @private
 * @type {number}
 */
sia.ui.NumericalKeypad.prototype.aciteveCount_ = 0;


/** @override */
sia.ui.NumericalKeypad.prototype.decorateInternal = function(element) {
	goog.base(this, 'decorateInternal', element);
	var keys = this.getElementsByClass(sia.ui.NumericalKey.CSS_CLASS,
			this.getElement());
	goog.structs.forEach(keys, function(key) {
		var number = parseInt(goog.dom.dataset.get(key, 'number'));
		var component = new sia.ui.NumericalKey(number, this.combinationalNumbers_);
		this.addChild(component);
		component.setParentEventTarget(this);
		component.decorate(key);
	}, this);

	var funcKeys = this.getElementsByClass(sia.ui.FunctionKey.CSS_CLASS,
			this.getElement());
	goog.structs.forEach(funcKeys, function(key) {
		var component = new sia.ui.FunctionKey(this.combinationalNumbers_);
		this.addChild(component);
		component.setParentEventTarget(this);
		component.decorate(key);
	}, this);
};


/**
 * Handles an activate event.
 * @param {?goog.events.Event} e Activate event to handle.
 */
sia.ui.NumericalKeypad.prototype.handleActivate = function(e) {
	++this.aciteveCount_;
	console.log('parent', e);
};


/**
 * Handles a deactivate event.
 * @param {?goog.events.Event} e Deactivate event to handle.
 */
sia.ui.NumericalKeypad.prototype.handleDeactivate = function(e) {
	if (--this.aciteveCount_) {
		this.combinationalNumbers_.push();
	}
	console.log('parent', e);
};


/**
 * A class for Numerical keypad renderer for SIA.
 *
 * @constructor
 * @extends {goog.ui.ContainerRenderer}
 */
sia.ui.NumericalKeypadRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.NumericalKeypadRenderer, goog.ui.ContainerRenderer);


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.getCssClass = function() {
	return sia.ui.NumericalKeypad.CSS_CLASS;
};
