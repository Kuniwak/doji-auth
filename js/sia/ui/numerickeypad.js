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
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.structs');
goog.require('goog.ui.Component');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secrets.CombinationalSymbols');
goog.require('sia.ui.VirtualSymbolKey');
goog.require('sia.ui.NumericalKey');
goog.require('sia.ui.NumericalKeyRenderer');
goog.require('sia.ui.SymbolKey.EventType');



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

	this.combinationalSymbols_ = new sia.secrets.CombinationalSymbols();
};
goog.inherits(sia.ui.NumericalKeypad, goog.ui.Container);


/**
 * Css class name for the keypad.
 * @const
 * @type {string}
 */
sia.ui.NumericalKeypad.CSS_CLASS = goog.getCssName('sia-buttons');
goog.ui.registry.setDecoratorByClassName(sia.ui.NumericalKeypad.CSS_CLASS,
		sia.ui.NumericalKeypad);


// Register a decorator factory function for goog.ui.Buttons.
goog.ui.registry.setDecoratorByClassName(sia.ui.NumericalKeypad.CSS_CLASS,
    function() {
      return new sia.ui.NumericalKeypad();
    });


/**
 * A count of acivated keys.
 * @private
 * @type {number}
 */
sia.ui.NumericalKeypad.prototype.aciteveCount_ = 0;


/** @override */
sia.ui.NumericalKeypad.prototype.addChildAt = function(control, index,
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
sia.ui.NumericalKeypad.prototype.getCombonationalSymbols = function() {
	return this.combinationalSymbols_;
};


/** @override */
sia.ui.NumericalKeypad.prototype.enterDocument = function() {
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
 * Handles a preaction event.
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.NumericalKeypad.prototype.handlePreaction = function(e) {
	++this.aciteveCount_;
};


/**
 * Handles a postaction event.
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.NumericalKeypad.prototype.handlePostaction = function(e) {
	if (--this.aciteveCount_) {
		this.combinationalSymbols_.push();
	}
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


sia.ui.NumericalKeypadRenderer


/**
 * Css class name for rows of buttons.
 * @const
 * @type {string}
 */
sia.ui.NumericalKeypadRenderer.ROW_CSS_CLASS = goog.getCssName(
		'sia-keys-row');


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.decorateChildren = function(container,
		element, opt_firstChild) {
	var rows = goog.dom.getElementsByClass(
			sia.ui.NumericalKeypadRenderer.ROW_CSS_CLASS, element);
	goog.structs.forEach(rows, function(row) {
		sia.ui.NumericalKeypadRenderer.superClass_.decorateChildren.call(this,
			container, row, opt_firstChild);
	}, this);
};


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.getDecoratorForChild = function(
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
sia.ui.NumericalKeypadRenderer.prototype.getCssClass = function() {
	return sia.ui.NumericalKeypad.CSS_CLASS;
};
