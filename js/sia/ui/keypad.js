// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric keypad for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.Keypad');
goog.provide('sia.ui.KeypadRenderer');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.structs');
goog.require('goog.ui.Component');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secrets.CombinationalSymbols');
goog.require('sia.ui.BackspaceKey');
goog.require('sia.ui.Key.EventType');
goog.require('sia.ui.NumericalKey');
goog.require('sia.ui.VirtualSymbolKey');



/**
 * A class for Numerical keypad for SIA.
 *
 * @constructor
 * @extends {goog.ui.Container}
 * @param {goog.ui.KeypadRenderer=} opt_renderer Renderer used to
 *		 render or decorate the container; defaults to
 *		 {@link goog.ui.ContainerRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *		 interaction.
 */
sia.ui.Keypad = function(opt_renderer, opt_domHelper) {
	goog.base(this, null, opt_renderer || new sia.ui.KeypadRenderer(),
			opt_domHelper);

	this.combinationalSymbols_ = new sia.secrets.CombinationalSymbols();
};
goog.inherits(sia.ui.Keypad, goog.ui.Container);


/**
 * Common events fired by numeric key.
 * @enum {string}
 */
sia.ui.Keypad.EventType = {
	UPDATE: 'update',
	COMPLETE: 'complete'
};


/**
 * @define {number} Interval to determine mis-input.
 */
sia.ui.Keypad.UPDATE_INTERVAL = 1000;


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


/**
 * A timer ID to detect a mis-input.
 * @private
 * @type {?number}
 */
sia.ui.Keypad.prototype.timerId_ = null;


/**
 * Returns a combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} The combinational symbols.
 */
sia.ui.Keypad.prototype.getCombinationalSymbols = function() {
	return this.combinationalSymbols_;
};


/** @override */
sia.ui.Keypad.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var handler = this.getHandler();

	handler.listen(
			/* src	*/ this,
			/* type */ sia.ui.Key.EventType.PREACTION,
			/* func */ this.handlePreaction);

	handler.listen(
			/* src	*/ this,
			/* type */ sia.ui.Key.EventType.POSTACTION,
			/* func */ this.handlePostaction);

	this.initialize();
};


/** @override */
sia.ui.Keypad.prototype.addChildAt = function(control, index, opt_render) {
	goog.base(this, 'addChildAt', control, index, opt_render);
	if (control instanceof sia.ui.BackspaceKey) {
		this.setBackspaceKey(control);
	}
};


/**
 * Sets a backspace key component.
 *
 * @param {sua.ui.BackspaceKey} key The backspace key.
 */
sia.ui.Keypad.prototype.setBackspaceKey = function(key) {
	this.bsKey_ = key;
};


/**
 * Returns a backspace key component if it was defined.
 *
 * @return {sua.ui.BackspaceKey=} The backspace key.
 */
sia.ui.Keypad.prototype.getBackspaceKey = function() {
	return this.bsKey_;
};


/**
 * Completes combinational symbols input.
 */
sia.ui.Keypad.prototype.complete = function() {
	this.dispatchEvent(sia.ui.Keypad.EventType.COMPLETE);
};


/**
 * Updates combinational symbols input.
 */
sia.ui.Keypad.prototype.update = function() {
	this.dispatchEvent(sia.ui.Keypad.EventType.UPDATE);
};


/**
 * Calls a function for each child in an array, and if the function returns true
 * adds the child to a new array.
 *
 * @param {function(this:T,?,number):?} f The function to call for every child
 *	 component; should take 2 arguments (the child and its index).
 * @param {T=} opt_obj Used as the 'this' object in f when called.
 * @return {Array.<goog.ui.Control>} Children in which only controls that
 *	 passed the test are present.
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
 * Enables or disables a backspace key.
 * @param {boolean} enable Whether to enable or disable the component.
 */
sia.ui.Keypad.prototype.setBackspaceKeyEnabled = function(enable) {
	var bs = this.getBackspaceKey();
	if (bs) {
		bs.setEnabled(enable);
	}
};


/**
 * Enables or disables symbol keys.
 * @param {boolean} enable Whether to enable or disable the component.
 */
sia.ui.Keypad.prototype.setInactiveSymbolKeysEnabled = function(enable) {
	this.forEachChild(function(child) {
		if (child !== this.getBackspaceKey() && !child.isActive()) {
			child.setEnabled(enable);
		}
	}, this);
};


/**
 * Returns a count of active keys.
 * @return {number} The count of active keys.
 */
sia.ui.Keypad.prototype.getActiveSymbolKeyCount = function() {
	return this.activeCount_;
};


/**
 * Returns a count of active keys.
 * @return {number} The count of active keys.
 */
sia.ui.Keypad.prototype.clearActiveSymbolKeyCount = function() {
	this.activeCount_ = 0;
};


/**
 * Increments active keys count.
 * @param {number=} opt_count Count of active keys to increment.
 */
sia.ui.Keypad.prototype.incrementActiveSymbolKeyCount = function(opt_count) {
	this.activeCount_ += goog.isDef(opt_count) ? opt_count : 1;
};


/**
 * Increments active keys count.
 * @param {number=} opt_count Count of active keys to increment.
 */
sia.ui.Keypad.prototype.decrementActiveSymbolKeyCount = function(opt_count) {
	this.activeCount_ -= goog.isDef(opt_count) ? opt_count : 1;
	if (this.activeCount_ < 0) {
		this.activeCount_ = 0;
	}
};


/**
 * Handles a preaction event.
 * @protected
 * @param {?goog.events.Event} e Preaction event to handle.
 */
sia.ui.Keypad.prototype.handlePreaction = function(e) {
	if (e.target !== this.getBackspaceKey()) {
		this.clearTimeout();
		if (this.getCombinationalSymbols().getCount() >=
				sia.secrets.CombinationalSymbols.MAX_COUNT) {
			this.setInactiveSymbolKeysEnabled(false);
		}
		this.update();
	}
};


/**
 * Handles a postaction event.
 * @protected
 * @param {?goog.events.Event} e Postaction event to handle.
 */
sia.ui.Keypad.prototype.handlePostaction = function(e) {
	if (e.target !== this.getBackspaceKey()) {
		this.clearTimeout();
		if (this.getActiveSymbolKeyCount() <= 0) {
			this.getCombinationalSymbols().push();
			this.setBackspaceKeyEnabled(true);
			if (this.getCombinationalSymbols().getCount() >=
					sia.secrets.CombinationalSymbols.MAX_COUNT) {
				this.setEnabled(false);
				this.complete();
			}
		}
		else {
			this.setTimeout();
		}
	}
	else {
		if (this.getCombinationalSymbols().getCount() <= 0) {
			this.setBackspaceKeyEnabled(false);
		}
		this.update();
	}
};


/**
 * Sets a timeout event.
 */
sia.ui.Keypad.prototype.setTimeout = function() {
	this.timerId_ = goog.Timer.callOnce(this.handleTimeout,
			sia.ui.Keypad.UPDATE_INTERVAL, this);
};


/**
 * Clears a timeout event.
 */
sia.ui.Keypad.prototype.clearTimeout = function() {
	if (goog.isDefAndNotNull(this.timerId_)) {
		goog.Timer.clear(this.timerId_);
		this.timerId_ = null;
	}
};


/**
 * Handles timeout event.
 * @protected
 */
sia.ui.Keypad.prototype.handleTimeout = function() {
	this.updateActiveKeys();
};


/**
 * Updates input by keys are active.
 */
sia.ui.Keypad.prototype.updateActiveKeys = function() {
	var symbols = this.getCombinationalSymbols();
	symbols.pop();
	this.activeCount_ = 0;
	this.forEachChild(function(key) {
		if (key.isActive()) {
			symbols.append(key.getSymbol());
			this.activeCount_++;
		}
	}, this);
	this.setInactiveSymbolKeysEnabled(true);
	this.update();
};


/**
 * Initializes keypad states.
 */
sia.ui.Keypad.prototype.initialize = function() {
	this.clearTimeout();
	this.getCombinationalSymbols().clear();
	this.clearActiveSymbolKeyCount();
	this.setEnabled(true);
	this.setInactiveSymbolKeysEnabled(true);
	this.setBackspaceKeyEnabled(false);
	this.dispatchEvent(sia.ui.Keypad.EventType.UPDATE);
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
	else if (goog.dom.classes.has(element, sia.ui.BackspaceKey.CSS_CLASS)) {
		return new sia.ui.BackspaceKey();
	}
	else {
		return goog.ui.registry.getDecorator(element);
	}
};


/** @override */
sia.ui.KeypadRenderer.prototype.getCssClass = function() {
	return sia.ui.Keypad.CSS_CLASS;
};
