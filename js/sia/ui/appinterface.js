// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for SIA (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.AppInterface');

goog.require('goog.ui.Component');
goog.require('sia.ui.Indicator');
goog.require('sia.ui.Keypad');



/**
 * A class for Table application interface.
 * The component includes {@link sia.ui.AppInterface}
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 */
sia.ui.AppInterface = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(sia.ui.AppInterface, goog.ui.Component);


/** @override */
sia.ui.AppInterface.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal');

  var keypad = this.getKeypad();
  keypad.decorate(this.getDomHelper().getElementByClass(
        sia.ui.Keypad.CSS_CLASS));

  var indicator = this.getIndicator();
  indicator.decorate(this.getDomHelper().getElementByClass(
        sia.ui.Indicator.CSS_CLASS));

  this.getHandler().listen(keypad, [
        sia.ui.Keypad.EventType.APPENDED,
        sia.ui.Keypad.EventType.POPPED,
        sia.ui.Keypad.EventType.REMOVED,
        sia.ui.Keypad.EventType.COMPLETED
      ], this.handleChangeSymbolsCount);
};


/**
 * Returns a keypad component.
 * @return {!sia.ui.Keypad} The keypad.
 */
sia.ui.AppInterface.prototype.getKeypad = function() {
  if (!this.keypad_) {
    this.keypad_ = new sia.ui.Keypad(null, this.getDomHelper());
    this.addChild(this.keypad_);
  }
  return this.keypad_;
};


/**
 * Returns a keypad component.
 * @return {!sia.ui.Indicator} The indicator.
 */
sia.ui.AppInterface.prototype.getIndicator = function() {
  if (!this.indicator_) {
    this.indicator_ = new sia.ui.Indicator(this.getDomHelper());
    this.addChild(this.indicator_);
  }
  return this.indicator_;
};


/**
 * Handles a change symbols count event as:
 * <ul>
 * <li>{@link sia.ui.Keypad.EventType.APPENDED}
 * <li>{@link sia.ui.Keypad.EventType.REMOVED}
 * <li>{@link sia.ui.Keypad.EventType.POPPED}
 * <li>{@link sia.ui.Keypad.EventType.COMPLETE}
 * </ul>
 * @param {goog.events.Event} e The change symbols event to handle.
 * @protected
 */
sia.ui.AppInterface.prototype.handleChangeSymbolsCount = function(e) {
  this.getIndicator().setValue(
      this.getKeypad().getCombinationalSymbols().getCount());
};
