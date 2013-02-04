// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a numeric key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.NumericalKey');
goog.provide('sia.ui.NumericalKeyRenderer');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');
goog.require('sia.ui.SymbolKey');



/**
 * A class for a numerical key for the SIA.
 *
 * @constructor
 * @extends {sia.ui.SymbolKey}
 *
 * @param {string} number The number string of the key.
 * @param {sia.ui.NumericalKeyRenderer=} opt_renderer Renderer used to
 *   render or decorate the numerical key; defaults to
 *   {@link sia.ui.NumericalKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *   interaction.
 */
sia.ui.NumericalKey = function(number, opt_renderer, opt_domHelper) {
  goog.base(this, number, opt_renderer || new sia.ui.NumericalKeyRenderer(),
      opt_domHelper);

  this.keyCode_ = goog.string.parseInt(this.getSymbol()) +
    goog.events.KeyCodes.ZERO;
};
goog.inherits(sia.ui.NumericalKey, sia.ui.SymbolKey);


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.NumericalKey.CSS_CLASS = goog.getCssName('sia-numerical-key');
goog.ui.registry.setDecoratorByClassName(sia.ui.NumericalKey.CSS_CLASS,
    sia.ui.NumericalKey);


/** @override */
sia.ui.NumericalKey.prototype.getKeyCode = function() {
  return this.keyCode_;
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


/** @override */
sia.ui.NumericalKeyRenderer.prototype.getCssClass = function() {
  return sia.ui.NumericalKey.CSS_CLASS;
};
