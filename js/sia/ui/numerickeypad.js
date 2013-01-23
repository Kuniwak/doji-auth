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
goog.require('sia.ui.FunctionKey');
goog.require('sia.ui.NumericalKey');
goog.require('sia.ui.NumericalKey.EventType');
goog.require('sia.ui.NumericalKeyRenderer');



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


sia.ui.NumericalKeypad.prototype.getCombonationalSymbols = function() {
	return this.combinationalSymbols_;
};


/** @override */
sia.ui.NumericalKeypad.prototype.enterDocument = function() {
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


/**
 * Css class name for rows of buttons.
 * @const
 * @type {string}
 */
sia.ui.NumericalKeypadRenderer.ROW_CSS_CLASS = goog.getCssName(
		'sia-button-row');


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.decorateChildren = function(container,
		element, opt_firstChild) {
	var rows = goog.dom.getElementsByClass(
			sia.ui.NumericalKeypadRenderer.ROW_CSS_CLASS, element);
	goog.structs.forEach(rows, function(element) {
		// The code is copy of goog.ui.ContainerRenderer.prototype.decorateChildren.
		if (element) {
			var node = opt_firstChild || element.firstChild, next;
			// Tag soup HTML may result in a DOM where siblings have different parents.
			while (node && node.parentNode == element) {
				// Get the next sibling here, since the node may be replaced or removed.
				next = node.nextSibling;
				if (node.nodeType == goog.dom.NodeType.ELEMENT) {
					// Decorate element node.
					var child = this.getDecoratorForChild(/** @type {Element} */(node),
						container); // (OrgaChem) Add second arguments.
					if (child) {
						// addChild() may need to look at the element.
						child.setElementInternal(/** @type {Element} */(node));
						// If the container is disabled, mark the child disabled too.  See
						// bug 1263729.  Note that this must precede the call to addChild().
						if (!container.isEnabled()) {
							child.setEnabled(false);
						}
						container.addChild(child);
						child.decorate(/** @type {Element} */(node));
					}
				} else if (!node.nodeValue || goog.string.trim(node.nodeValue) == '') {
					// Remove empty text node, otherwise madness ensues (e.g. controls that
					// use goog-inline-block will flicker and shift on hover on Gecko).
					element.removeChild(node);
				}
				node = next;
			}
		}
	}, this);
};


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.getDecoratorForChild = function(
		element, container) {
	if (goog.dom.classes.has(element, sia.ui.NumericalKey.CSS_CLASS)) {
		var number = parseInt(goog.dom.dataset.get(element, 'number'));
		return new sia.ui.NumericalKey(number, container.getCombonationalSymbols());
	}
	else if (goog.dom.classes.has(element, sia.ui.FunctionKey.CSS_CLASS)) {
		return new sia.ui.FunctionKey(container.getCombonationalSymbols());
	}
	else {
		return goog.ui.registry.getDecorator(element);
	}
};


/** @override */
sia.ui.NumericalKeypadRenderer.prototype.getCssClass = function() {
	return sia.ui.NumericalKeypad.CSS_CLASS;
};
