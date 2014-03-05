/**
 * @fileoverview An entry point of the web app.
 */


goog.provide('main');

goog.require('sia.App');


/**
 * Entry point of the web app.
 */
(function() {
  /**
   * The application instance.
   * @type {sia.App}
   */
  goog.global.app = new sia.App();
})();
