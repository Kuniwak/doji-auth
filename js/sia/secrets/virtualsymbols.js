// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for Secret Information for SIA (Simultaneous
 * Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.secrets.VirtualSymbol');
goog.provide('sia.secrets.resolveSet');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.structs');
goog.require('goog.structs.Map');


/**
 * A virtual symbols.
 * @enum {number}
 */
sia.secrets.VirtualSymbol = {
	LARGE: 'L',
	MEDIUM: 'M',
	SMALL: 'S'
};


/**
 * Resolves virtual symbols from a set of symbols.
 * The result is map of symbols and each count.
 * @private
 * @param {goog.structs.Set.<string>} set The set of symbols.
 * @return {goog.structs.Map.<string, number>} Pairs of symbols and each counts.
 */
sia.secrets.resolveSet = function(set) {
	var hasLarge = false, hasMedium = false, hasSmall = false;
	var Symbol = sia.secrets.VirtualSymbol;
	var sorted = [];
	var map = new goog.structs.Map();

	goog.structs.forEach(set, function(symbol) {
		switch (symbol) {
			case Symbol.LARGE:
				hasLarge = true;
				break;
			case Symbol.MEDIUM:
				hasMedium = true;
				break;
			case Symbol.LARGE:
				hasSmall = true;
				break;
			default:
				goog.array.binaryInsert(sorted, symbol);
				map.set(symbol, 1);
				break;
		}
	});

	if (hasLarge) {
		var larger = goog.array.peek(sorted);
		map.set(larger, map.get(larger) + 1);
	}
	if (hasMedium) {
		var medium = sorted[sorted.length > 2 ? 1 : 0];
		map.set(medium, map.get(medium) + 1);
	}
	if (hasSmall) {
		var small = sorted[0];
		map.set(small, map.get(small) + 1);
	}

	return map;
};
