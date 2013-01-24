// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric keypad for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.Keypad');
goog.provide('sia.ui.KeypadRenderer');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.structs');
goog.require('goog.ui.Component');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secrets.CombinationalSymbols');
goog.require('sia.ui.NumericalKey');
goog.require('sia.ui.NumericalKeyRenderer');
goog.require('sia.ui.SymbolKey.EventType');
goog.require('sia.ui.VirtualSymbolKey');



/**
 * A class for Numerical keypad for SIA.
 *
 * @constructor
 * @extends {goog.ui.Container}
 * @param {goog.ui.KeypadRenderer=} opt_renderer Renderer used to
 *     render or decorate the container; defaults to
 *     {@link goog.ui.ContainerRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 */
sia.ui.Keypad = function(opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer || new sia.ui.KeypadRenderer(),
			opt_domHelper);

	this.combinationalSymbols_ = new sia.secrets.CombinationalSymbols();
};
goog.inherits(sia.ui.Keypad, goog.ui.Container);


/**
 * Css class name for the keypad.
 * @const
 * @type {string}
 */
sia.ui.Keypad.CSS_CLASS = goog.getCssName('sia-buttons');
goog.ui.registry.setDecoratorByClassName(sia.ui.Keypad.CSS_CLASS,
		sia.ui.Keypad);


// Register a decorator factory function for goog.ui.Buttons.
goog.ui.registry.setDecoratorByClassName(sia.ui.Keypad.CSS_CLASS,
    function() {
      return new sia.ui.Keypad();
    });


/**
 * A count of acivated keys.
 * @private
 * @type {number}
 */
sia.ui.Keypad.prototype.activeCount_ = 0;


/** @override */
sia.ui.Keypad.prototype.addChildAt = function(control, index,
		opt_render) {
	goog.base(this, 'addChildAt', control, index, opt_render);
	if (control.setCombinationalSymbols) {
		control.setCombinationalSymbols(this.getCombonationalSymbols());
	}
};


/**
 * Returns a combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} The combinational symbols.
 */
sia.ui.Keypad.prototype.getCombonationalSymbols = function() {
	return this.combinationalSymbols_;
};


/** @override */
sia.ui.Keypad.prototype.enterDocument = function() {
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
};


/**
 * Calls a function for each child in an array, and if the function returns true
 * adds the child to a new array.
 *
 * @param {function(this:T,?,number):?} f The function to call for every child
 *   component; should take 2 arguments (the child and its index).
 * @param {T=} opt_obj Used as the 'this' object in f when called.
 * @return {Array.<goog.ui.Control>} Children in which only controls that
 *   passed the test are present.
 */
sia.ui.Keypad.prototype.filterChildren = function(f, opt_obj) {
	var children = [];
	var childCount = 0;

	this.forEachChild(function(child, index) {
		if (f.call(opt_obj, child, index)) {
			children[childCount++] = child;
		}
	});

	return children;
};


/**
 * Disable inactive children.
 */
sia.ui.Keypad.prototype.disableInactiveChildren = function() {
	this.forEachChild(function(child) {
		if (!child.isActive()) {
			child.setEnabled(false);
		}
	});
};


/**
 * Handles a preaction event.
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.Keypad.prototype.handlePreaction = function(e) {
	++this.activeCount_;
	if (this.getCombonationalSymbols().getCount() >=
			sia.secrets.CombinationalSymbols.MAX_COUNT) {
		this.disableInactiveChildren();
	}
};


/**
 * Handles a postaction event.
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.Keypad.prototype.handlePostaction = function(e) {
	if (--this.activeCount_) {
		this.combinationalSymbols_.push();
	}

	if (this.getCombonationalSymbols().getCount() >=
			sia.secrets.CombinationalSymbols.MAX_COUNT) {
		this.disableInactiveChildren();
	}
};



/**
 * A class for Numerical keypad renderer for SIA.
 *
 * @constructor
 * @extends {goog.ui.ContainerRenderer}
 */
sia.ui.KeypadRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.KeypadRenderer, goog.ui.ContainerRenderer);


/**
 * Css class name for rows of buttons.
 * @const
 * @type {string}
 */
sia.ui.KeypadRenderer.ROW_CSS_CLASS = goog.getCssName(
		'sia-keys-row');


/** @override */
sia.ui.KeypadRenderer.prototype.decorateChildren = function(container,
		element, opt_firstChild) {
	var rows = goog.dom.getElementsByClass(
			sia.ui.KeypadRenderer.ROW_CSS_CLASS, element);
	goog.structs.forEach(rows, function(row) {
		sia.ui.KeypadRenderer.superClass_.decorateChildren.call(this,
			container, row, opt_firstChild);
	}, this);
};


/** @override */
sia.ui.KeypadRenderer.prototype.getDecoratorForChild = function(
		element) {
			var symbol;
	if (goog.dom.classes.has(element, sia.ui.NumericalKey.CSS_CLASS)) {
		symbol = goog.dom.dataset.get(element, 'symbol');
		return new sia.ui.NumericalKey(symbol);
	}
	else if (goog.dom.classes.has(element, sia.ui.VirtualSymbolKey.CSS_CLASS)) {
		symbol = goog.dom.dataset.get(element, 'symbol');
		return new sia.ui.VirtualSymbolKey(symbol);
	}
	else {
		return goog.ui.registry.getDecorator(element);
	}
};


/** @override */
sia.ui.KeypadRenderer.prototype.getCssClass = function() {
	return sia.ui.Keypad.CSS_CLASS;
};
