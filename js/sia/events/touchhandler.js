// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The touch event handler for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.events.TouchHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.structs.Map');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sia.events.TouchHandler = function(element) {
	goog.base(this);

	this.element_ = element;
	this.listener_ = new goog.events.EventHandler(this);
};
goog.inherits(sia.events.TouchHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
sia.events.TouchHandler.EventType = {
	TOUCHENTER: 'touchenter',
	TOUCHLEAVE: 'touchleave'
};


/**
 *
 */
sia.events.TouchHandler.prototype.last_ = false;


sia.events.TouchHandler.prototype.attach = function() {
	this.listener_.listen(this.element_, goog.events.EventType.TOUCHSTART,
			this.handleTouchStart);
};


/** @override */
sia.events.TouchHandler.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
	delete this.element_;
	this.listener_.dispose();
};


/**
 * Handles a touch start event.
 * @param {goog.events.Event} e The touch start event.
 */
sia.events.TouchHandler.prototype.handleTouchStart = function(e) {
	this.last_ = e.
};
