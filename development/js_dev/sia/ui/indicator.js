// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a indicator for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.Indicator');
goog.require('goog.ui.ProgressBar');
goog.require('sia.secrets.CombinationalSymbols');



/**
 * A class for indigator component to display a combinational symbols count.
 * @constructor
 * @extends {goog.ui.ProgressBar}
 */
sia.ui.Indicator = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.setStep(1);
  this.setMinimum(0);
  this.setMaximum(sia.secrets.CombinationalSymbols.MAX_COUNT);
  this.setOrientation(goog.ui.ProgressBar.Orientation.HORIZONTAL);
};
goog.inherits(sia.ui.Indicator, goog.ui.ProgressBar);


/**
 * A class name for an indicator.
 * @const
 * @type {string}
 */
sia.ui.Indicator.CSS_CLASS = goog.getCssName('sia-indicator');
