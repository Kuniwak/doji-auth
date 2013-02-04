// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a backspace key for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.BackspaceKey');
goog.provide('sia.ui.BackspaceKeyRenderer');

goog.require('goog.events.KeyCodes');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');
goog.require('sia.debug');
goog.require('sia.ui.Key');



/**
 * A class for a virtual symbol key for the SIA.
 *
 * @constructor
 * @extends {sia.ui.SymbolKey}
 *
 * @param {sia.ui.BackspaceKeyRenderer=} opt_renderer Renderer used to
 *   render or decorate the numerical key; defaults to
 *   {@link sia.ui.BackspaceKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.BackspaceKey = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer || new sia.ui.BackspaceKeyRenderer(),
      opt_domHelper);
};
goog.inherits(sia.ui.BackspaceKey, sia.ui.Key);


/**
 * @type {string}
 */
sia.ui.BackspaceKey.SYMBOL = '\b';


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.BackspaceKey.CSS_CLASS = goog.getCssName('sia-backspace-key');


/**
 * Whether a key is backspace key.
 * @param {goog.ui.Component} Component to test.
 * @return {boolean} Whether a key is backspace key.
 */
sia.ui.BackspaceKey.isBackspaceKey = function(key) {
  return !!key.getSymbol && key.getSymbol() === sia.ui.BackspaceKey.SYMBOL;
};


/** @override */
sia.ui.BackspaceKey.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var parent = this.getParent();
  this.setEnabled(parent.getActiveSymbolKeyCount() <= 0 &&
      !parent.getCombinationalSymbols().isEmpty());

  this.getHandler().listen(this.getParent(), [
    sia.ui.Keypad.EventType.APPENDED,
    sia.ui.Keypad.EventType.REMOVED,
    sia.ui.Keypad.EventType.PUSHED,
    sia.ui.Keypad.EventType.POPPED,
    sia.ui.Keypad.EventType.COMPLETED], this.handleSimultaneousInputPeriod);
};


/** @override */
sia.ui.BackspaceKey.prototype.getKeyCode = function() {
  return goog.events.KeyCodes.BACKSPACE;
};


/** @override */
sia.ui.BackspaceKey.prototype.getSymbol = function() {
  return sia.ui.BackspaceKey.SYMBOL;
};


/** @override */
sia.ui.BackspaceKey.prototype.handleActivated = function(e) {
  var parent = this.getParent();
  if (parent) {
    goog.array.forEach(parent.getSymbolKeys(), function(key) {
      key.setEnabled(false);
    });
  }
};


/** @override */
sia.ui.BackspaceKey.prototype.handleDeactivated = function(e) {
  var parent = this.getParent();
  if (parent && !parent.getCombinationalSymbols().isEmpty()) {
    parent.popAppendedSymbols();

    goog.array.forEach(parent.getSymbolKeys(), function(key) {
      key.setEnabled(true);
    });

    if (sia.debug.LOG_ENABLE) {
      var logger = goog.debug.LogManager.getLogger('sia.ui.BackspaceKey');
      logger.finest('Backspace: ' + parent.getCombinationalSymbols());
    }
  }
};


/**
 * Handles a simulataneous input period event as:
 * <ul>
 * <li>{@link sia.ui.Keypad.EventType.PUSHED}
 * <li>{@link sia.ui.Keypad.EventType.POPPED}
 * <li>{@link sia.ui.Keypad.EventType.COMPLETED}
 * </ul>
 * @param {goog.events.Event} e The simulataneous input event to handle.
 * @protected
 */
sia.ui.BackspaceKey.prototype.handleSimultaneousInputPeriod = function(e) {
  var parent = this.getParent();

  var enable = parent.getActiveSymbolKeyCount() <= 0 &&
      !parent.getCombinationalSymbols().isEmpty();

  this.setEnabled(enable);
};



/**
 * A class for a function key renderer for the SIA.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
sia.ui.BackspaceKeyRenderer = function() {
  goog.base(this);
};
goog.inherits(sia.ui.BackspaceKeyRenderer, goog.ui.ButtonRenderer);
goog.ui.registry.setDefaultRenderer(sia.ui.BackspaceKey,
    function() { return new sia.ui.BackspaceKeyRenderer(); });


/** @override */
sia.ui.BackspaceKeyRenderer.prototype.getCssClass = function() {
  return sia.ui.BackspaceKey.CSS_CLASS;
};
