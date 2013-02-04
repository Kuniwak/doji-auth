// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The touch event handler for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

<<<<<<< HEAD
goog.provide('sia.events.TouchHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.structs.Map');
=======
goog.provide('sia.events.TouchEnterLeaveHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.structs.Set');
>>>>>>> keyevent-without-crossbrowser


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sia.events.TouchEnterLeaveHandler = function(opt_element, opt_capture) {
  goog.base(this);

  this.listener_ = new goog.events.EventHandler(this);
  if (opt_element) {
    this.attach(opt_element, opt_capture);
  }

  sia.events.TouchEnterLeaveHandler.handlerSet_.add(this);
};
goog.inherits(sia.events.TouchEnterLeaveHandler, goog.events.EventTarget);


/**
 * @private
 */
sia.events.TouchEnterLeaveHandler.handlerSet_ = new goog.structs.Set();


/**
 * @enum {string}
 */
sia.events.TouchEnterLeaveHandler.EventType = {
  TOUCHENTER: 'touchenter',
  TOUCHLEAVE: 'touchleave'
};


sia.events.TouchEnterLeaveHandler.prototype.wasEntered_ = false;

sia.events.TouchEnterLeaveHandler.prototype.wasLeaved_ = false;


/** @override */
sia.events.TouchEnterLeaveHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.element_;
  this.listener_.dispose();
};


sia.events.TouchEnterLeaveHandler.prototype.attach = function(element, opt_capture) {
  if (this.element_) {
    this.detach();
  }

  this.element_ = element;

  this.listener_.listen(this.element_, goog.events.EventType.TOUCHSTART,
      this.handleTouchStart, opt_capture);
};


sia.events.TouchEnterLeaveHandler.prototype.detach = function() {
  this.listener_.removeAll();
};


/** @override */
sia.events.TouchEnterLeaveHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.element_;
  this.listener_.dispose();
};


/**
 * Handles a touch start event.
 * @param {goog.events.Event} e The touch start event.
 */
sia.events.TouchEnterLeaveHandler.prototype.handleTouchStart = function(e) {
  this.wasEntered_ = true;
};


/**
 * Handles a touch move event.
 * @param {goog.events.Event} e The touch start event.
 */
sia.events.TouchEnterLeaveHandler.prototype.handleTouchMove = function(e) {
  
};


/**
 * Handles a touch end event.
 * @param {goog.events.Event} e The touch start event.
 */
sia.events.TouchEnterLeaveHandler.prototype.handleTouchEnd = function(e) {
  this.wasLeaved_ = true;
};
