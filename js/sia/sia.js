// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The base script for SIA (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia');

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.debug.LogManager');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyNames');
goog.require('goog.iter');
goog.require('goog.json');
goog.require('goog.object');
goog.require('goog.ui.Component');
goog.require('sia.auth.AuthenticationHelper');
goog.require('sia.ui.Indicator');
goog.require('sia.ui.Keypad');


/**
 * Element ID of a keypad.
 * @const
 * @type {string}
 */
sia.KEYPAD_ID = 'sia-keys';


/**
 * Element ID of an indicator.
 * @const
 * @type {string}
 */
sia.INDICATOR_ID = 'sia-indicator';


/**
 * @define {boolean} Log input sequences if true.
 */
sia.LOG_ENABLED = true;


/**
 * @private
 * @type {sia.ui.Keypad}
 */
sia.numKeys_ = new sia.ui.Keypad();


/**
 * @private
 * @type {sia.ui.Indicator}
 */
sia.indicator_ = new sia.ui.Indicator();


/**
 * @private
 * @type {sia.auth.AuthenticationHelper}
 */
sia.authHelper_ = new sia.auth.AuthenticationHelper();

sia.correct_ = new sia.secrets.CombinationalSymbols();
sia.correct_.append('1');
sia.correct_.append('2');
sia.correct_.append('3');
sia.correct_.push();
sia.correct_.append('5');

sia.authHelper_.setCorrect(sia.correct_);


/**
 * @private
 * @type {goog.debug.Logger} The logger.
 */
sia.logger_ = null;

if (sia.LOG_ENABLED) {
	goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
	sia.logger_ = goog.debug.Logger.getLogger('sia');

	sia.console_ = new goog.debug.Console();
	sia.console_.setCapturing(true);

	var last_ = null;
	goog.events.listen(document, [goog.events.EventType.KEYDOWN,
			goog.events.EventType.KEYUP], function(e) {
		if (last_ !== e.keyCode) {
			sia.logger_.finest(e.type + ':' + goog.events.KeyNames[e.keyCode]);
			last_ = e.keyCode;
		}
	});

	sia.numKeys_.addEventListener(sia.ui.Keypad.EventType.UPDATE, function(e) {
		var keypad = e.target;
		sia.logger_.finer('Updated: ' + keypad.getCombinationalSymbols());
	});

	sia.numKeys_.addEventListener(sia.ui.Keypad.EventType.COMPLETE, function(e) {
		var keypad = e.target;
		var symbols = keypad.getCombinationalSymbols();
		var maps = sia.secrets.CombinationalSymbols.resolve(symbols);
		var resolveds = goog.array.map(maps, function(map) {
			var resolved = [];
			goog.iter.forEach(map.getKeyIterator(), function(key) {
				var max = map.get(key);
				for (var i = 0; i < max; i++) {
					resolved.push(key);
				}
			});
			return resolved;
		});
		sia.logger_.finer('Completed: ' + goog.json.serialize(resolveds));
	});
}

sia.numKeys_.addEventListener(sia.ui.Keypad.EventType.UPDATE, function(e) {
	var keypad = e.target;
	sia.indicator_.setValue(keypad.getCombinationalSymbols().getCount());
});

sia.numKeys_.addEventListener(sia.ui.Keypad.EventType.COMPLETE, function(e) {
	var keypad = e.target;
	if (sia.authHelper_.authenticate(keypad.getCombinationalSymbols())) {
		alert('O Success');
	}
	else {
		alert('X Failed');
	}
	keypad.initialize();
});

sia.indicator_.decorate(goog.dom.getElement(sia.INDICATOR_ID));
sia.numKeys_.decorate(goog.dom.getElement(sia.KEYPAD_ID));
