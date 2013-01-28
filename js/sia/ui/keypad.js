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
goog.require('goog.events.EventType');
goog.require('goog.math.Vec2');
goog.require('goog.structs');
goog.require('goog.ui.Component');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.registry');
goog.require('sia.secrets.CombinationalSymbols');
goog.require('sia.ui.BackspaceKey');
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

	this.touchPositionMap_ = new goog.structs.Map();
	this.combinationalSymbols_ = new sia.secrets.CombinationalSymbols();
	this.touches_ = [];

	this.symbolKeyActivityMap_ = new goog.structs.Map();
	this.symbolComponentMap_ = new goog.structs.Map();
};
goog.inherits(sia.ui.Keypad, goog.ui.Container);


/**
 * Common events fired by numeric key.
 * @enum {string}
 */
sia.ui.Keypad.EventType = {
  /** Dispatched after a symbol was appended. */
	APPENDED: 'appended',
  /** Dispatched after a symbol was removed. */
	REMOVED: 'removed',
  /** Dispatched after symbols were pushed. */
	PUSHED: 'pushed',
  /** Dispatched after symbols were popped. */
	POPPED: 'popped',
  /** Dispatched before inputs was complete. */
	COMPLETE: 'complete',
  /** Dispatched after inputs was complete. */
	COMPLETED: 'completed'
};


/**
 * @define {number} Interval to judge whether a mis-input was occured.
 */
sia.ui.Keypad.MODIFICATION_DETECTION_INTERVAL = 1000;


/**
 * @define {number} Interval to refresh keys activities.
 */
sia.ui.Keypad.REFRESH_KEY_ACTIVITIES_INTERVAL = 200;


/**
 * Css class name for the keypad.
 * @const
 * @type {string}
 */
sia.ui.Keypad.CSS_CLASS = goog.getCssName('sia-keys');


// Register a decorator factory function for goog.ui.Buttons.
goog.ui.registry.setDecoratorByClassName(sia.ui.Keypad.CSS_CLASS,
		function() {
			return new sia.ui.Keypad();
		});


/**
 * A timer ID to detect a mis-input.
 * @private
 * @type {?number}
 */
sia.ui.Keypad.prototype.timerId_ = null;


/**
 * A map to store activities of each symbol keys.
 * @private
 * @type {goog.structs.Map<string, number>}
 */
sia.ui.Keypad.prototype.symbolKeyActivityMap_;


/**
 * A map to store components of each symbol keys.
 * @private
 * @type {goog.structs.Map<string, goog.ui.Component>}
 */
sia.ui.Keypad.prototype.symbolComponentMap_;


/** @override */
sia.ui.Keypad.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');
	var element = this.getElement();

	var timer = this.timer_ = new goog.Timer(
			sia.ui.Keypad.REFRESH_KEY_ACTIVITIES_INTERVAL);

	this.getHandler().
		listen(element, goog.events.EventType.TOUCHSTART, this.handleTouchStart).
		listen(element, goog.events.EventType.TOUCHMOVE, this.handleTouchMove).
		listen(element, goog.events.EventType.TOUCHEND, this.handleTouchEnd).
		listen(timer, goog.Timer.TICK, this.handleTouchRefresh);

	timer.start();
};


/** @override */
sia.ui.Keypad.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
	if (this.timer_) {
		this.timer_.dispose();
	}
};


/** @override */
sia.ui.Keypad.prototype.addChildAt = function(control, index, opt_render) {
	goog.base(this, 'addChildAt', control, index, opt_render);
	if (goog.isDef(control.getSymbol)) {
		this.symbolComponentMap_.set(control.getSymbol(), control);
	}
	else {
		this.setBackspaceKey(control);
	}
};


/**
 * Returns a combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} The combinational symbols.
 */
sia.ui.Keypad.prototype.getCombinationalSymbols = function() {
	return this.combinationalSymbols_;
};


/**
 * Appends a symbol.
 * @param {string} symbol The symbol to append.
 * @return {boolean} Whether the symbol was appended.
 */
sia.ui.Keypad.prototype.appendSymbol = function(symbol) {
	if (this.getCombinationalSymbols().append(symbol)) {
		this.dispatchEvent(sia.ui.Keypad.EventType.APPENDED);
		return true;
	}
	return false;
};


/**
 * Removes a symbol.
 * @param {string} symbol The symbol to remvoe.
 * @return {boolean} Whether the symbol was removed.
 */
sia.ui.Keypad.prototype.removeSymbol = function(symbol) {
	if (this.getCombinationalSymbols().remove(symbol)) {
		this.dispatchEvent(sia.ui.Keypad.EventType.REMOVED);
		return true;
	}
	return false;
};


/**
 * Pushes appended symbols.
 */
sia.ui.Keypad.prototype.pushAppendedSymbols = function() {
	goog.asserts.assert(this.getActiveSymbolKeyCount() === 0,
			'Some keys are active yet. Remaines: ' + this.getActiveSymbolKeyCount());
	this.getCombinationalSymbols().push();
	if (this.getCombinationalSymbols().getCount() >=
			sia.secrets.CombinationalSymbols.MAX_COUNT) {
		this.dispatchEvent(sia.ui.Keypad.EventType.COMPLETE);
		this.getCombinationalSymbols().clear();
		this.setEnabled(true);
		this.dispatchEvent(sia.ui.Keypad.EventType.COMPLETED);
	}
	else {
		this.dispatchEvent(sia.ui.Keypad.EventType.PUSHED);
	}
};


/**
 * Pushes appended symbols.
 */
sia.ui.Keypad.prototype.popAppendedSymbols = function() {
	goog.asserts.assert(this.getActiveSymbolKeyCount() === 0,
			'Some keys are active yet. Remaines: ' + this.getActiveSymbolKeyCount());
	this.getCombinationalSymbols().pop();
	this.dispatchEvent(sia.ui.Keypad.EventType.POPPED);
};


/**
 * Sets an activity to a symbol key.
 * @param {string} symbol The symbol to sets activity.
 * @param {boolean} enable Whether the symbol is active.
 */
sia.ui.Keypad.prototype.setSymbolKeyActive = function(symbol, enable) {
	this.symbolKeyActivityMap_.set(symbol, enable);
};


/**
 * Whether a symbol key is active.
 * @param {string} symbol The symbol to sets activity.
 * @return {boolean} Whether the symbol is active.
 */
sia.ui.Keypad.prototype.isActiveSymbolKey = function(symbol) {
	return !!this.symbolKeyActivityMap_.get(symbol);
};


/**
 * Returns a count of active keys.
 * @return {number} Count of active symbol keys.
 */
sia.ui.Keypad.prototype.getActiveSymbolKeyCount = function() {
	var states = this.symbolKeyActivityMap_.getValues();
	return goog.array.reduce(states, function(res, state) {
		return res + state;
	}, 0);
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
 * Returns an array of symbol keys that are child of a keypad.
 * @return {Array.<sia.ui.SymbolKey>} Array of child symbol keys.
 */
sia.ui.Keypad.prototype.getSymbolKeys = function() {
	return this.symbolComponentMap_.getValues();
};


/**
 * Sets a timeout event.
 */
sia.ui.Keypad.prototype.setTimeout = function() {
	if (goog.isDefAndNotNull(this.timerId_)) {
		this.clearTimeout();
	}
	this.timerId_ = goog.Timer.callOnce(this.handleTimeout,
			sia.ui.Keypad.MODIFICATION_DETECTION_INTERVAL, this);
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
	goog.array.forEach(this.getSymbolKeys(), function(key) {
		var symbol = key.getSymbol();
		if (!key.isActive() && symbols.isAppended(symbol)) {
			symbols.remove(symbol);
		}
	}, this);
	this.dispatchEvent(sia.ui.Keypad.EventType.REMOVED);
};


/**
 * Handles timeout event for refresh touches map.
 * @protected
 */
sia.ui.Keypad.prototype.handleTouchRefresh = function() {
	var map = this.touchPositionMap_;
	goog.array.forEach(map.getValues(), function() {
		
	});
	this.consoleTouchMap_();
};


/** @private */
sia.ui.Keypad.prototype.consoleTouchMap_ = function() {
	var map = this.touchPositionMap_;
	goog.array.forEach(map.getKeys(), function(key) {
		var vec = map.get(key);
		console.log(key + ': {' + vec.x + ', ' + vec.y + '}');
	});
};


/**
 * Touch position map. Refreshed every {@link
 * sia.ui.Keypad.REFRESH_KEY_ACTIVITIES_INTERVAL} milliseconds interval.
 * @type {goog.structs.Map}
 */
sia.ui.Keypad.prototype.touchPositionMap_;


/**
 * Handles a touch start event.
 * @protected
 * @param {?goog.events.Event} e Touchstart event to handle.
 */
sia.ui.Keypad.prototype.handleTouchStart = function(e) {
	var touches = e.getBrowserEvent().changedTouches;
	var map = this.touchPositionMap_;
	goog.array.forEach(touches, function(touch) {
		map.set(touch.identifier, new goog.math.Vec2(touch.pageX, touch.pageY));
	});
	e.preventDefault();
	e.stopPropagation();
};


/**
 * Handles a touch move event.
 * @protected
 * @param {goog.events.Event} e Touchmove event to handle.
 */
sia.ui.Keypad.prototype.handleTouchMove = function(e) {
	var touches = e.getBrowserEvent().changedTouches;
	var map = this.touchPositionMap_;
	goog.array.forEach(touches, function(touch) {
		var vec = map.get(touch.identifier);
		vec.x = touch.pageX;
		vec.y = touch.pageY;
	});
	e.preventDefault();
	e.stopPropagation();
};


/**
 * Handles a touch end event.
 * @protected
 * @param {goog.events.Event} e Touchend event to handle.
 */
sia.ui.Keypad.prototype.handleTouchEnd = function(e) {
	var touches = e.getBrowserEvent().changedTouches;
	var map = this.touchPositionMap_;
	goog.array.forEach(touches, function(touch) {
		map.remove(touch.identifier);
	});
	e.preventDefault();
	e.stopPropagation();
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
sia.ui.KeypadRenderer.ROW_CSS_CLASS = goog.getCssName('sia-keys-row');


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
