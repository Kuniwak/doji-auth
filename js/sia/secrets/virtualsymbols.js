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
	SMALL: 'S',
	UNDEFINED: '*'
};


/**
 * Resolves virtual symbols from a set of symbols.
 * The result is map of symbols and each count.
 *
 * There are resolve rule: a,b,c are any numbers, and a < b < c.
 * <ul>
 * <li>a + (L|M|S) = aa</li>
 * <li>a + L + M = aaa</li>
 * <li>a + M + S = aaa</li>
 * <li>a + L + S = aaa</li>
 * <li>a + b + L = abb</li>
 * <li>a + b + M = aab</li>
 * <li>a + b + S = aab</li>
 * <li>a + L + M + S = aaaa</li>
 * <li>a + b + M + S = aaab</li>
 * <li>a + b + L + S = aabb</li>
 * <li>a + b + L + M = abbb</li>
 * <li>a + b + c + L = abcc</li>
 * <li>a + b + c + M = abbc</li>
 * <li>a + b + c + S = aabc</li>
 * </ul>
 *
 * @private
 * @param {goog.structs.Set.<string>} set The set of symbols.
 * @return {goog.structs.Map.<string, number>} Pairs of symbols and each counts.
 */
sia.secrets.resolveSet = function(set) {
	var hasLarger = false, hasMedium = false, hasSmaller = false;
	var Symbol = sia.secrets.VirtualSymbol;
	var sorted = [];
	var map = new goog.structs.Map();
	map.set('*', 0)

	goog.structs.forEach(set, function(symbol) {
		switch (symbol) {
			case Symbol.LARGE:
				hasLarger = true;
				break;
			case Symbol.MEDIUM:
				hasMedium = true;
				break;
			case Symbol.SMALL:
				hasSmaller = true;
				break;
			default:
				goog.array.binaryInsert(sorted, symbol);
				map.set(symbol, 1);
				break;
		}
	});

	var larget, medium, smaller;
	if (hasLarger) {
		larger = goog.array.peek(sorted) || Symbol.UNDEFINED;
		map.set(larger, map.get(larger) + 1);
	}
	if (hasSmaller) {
		smaller = sorted[0] || Symbol.UNDEFINED;
		map.set(smaller, map.get(smaller) + 1);
	}
	if (hasMedium) {
		var len = sorted.length;
		switch (len) {
			case 3:
				medium = sorted[1] || Symbol.UNDEFINED;
				break;
			case 2:
				medium = sorted[hasLarger ? 1 : 0] || Symbol.UNDEFINED;
				break;
			default:
				medium = sorted[0] || Symbol.UNDEFINED;
				break;
		}
		map.set(medium, map.get(medium) + 1);
	}

	return map;
};
