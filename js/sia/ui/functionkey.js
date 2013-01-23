// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a function key for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.FunctionKey');
goog.provide('sia.ui.FunctionKeyRenderer');
goog.require('goog.dom');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');



/**
 * A class for a function key for the SIA.
 *
 * @param {sia.ui.FunctionKey.FunctionType} num The string of the number.
 * @param {sia.secret.CombinationalSymbols} combiNum The comnational numbers.
 * @param {sia.ui.FunctionKeyRenderer=} opt_renderer Renderer used to
 *     render or decorate the function key; defaults to
 *     {@link sia.ui.FunctionKeyRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 * @constructor
 * @extends {goog.ui.Button}
 */
sia.ui.FunctionKey = function(content, opt_renderer, opt_domHelper) {
	goog.base(this, content, opt_renderer ||
			new sia.ui.FunctionKeyRenderer(), opt_domHelper);
};
goog.inherits(sia.ui.FunctionKey, goog.ui.Button);


/**
 * The css class name.
 * @const
 * @type {string}
 */
sia.ui.FunctionKey.CSS_CLASS = goog.getCssName('sia-func-button');


/**
 * A class for a function key renderer for the SIA.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
sia.ui.FunctionKeyRenderer = function() {
	goog.base(this);
};
goog.inherits(sia.ui.FunctionKeyRenderer, goog.ui.ButtonRenderer);
goog.ui.registry.setDefaultRenderer(sia.ui.FunctionKey,
		sia.ui.FunctionKeyRenderer);


/** @override */
sia.ui.FunctionKeyRenderer.prototype.getCssClass = function() {
	return sia.ui.FunctionKey.CSS_CLASS;
};
