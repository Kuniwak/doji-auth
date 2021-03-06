// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for combinational symbols as a secret information
 *   module for SIA (Simultaneous Inputable Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.secrets.CombinationalSymbols');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.structs.Set');
goog.require('sia.secrets.VirtualSymbol');
goog.require('sia.secrets.resolveSet');



/**
 * A class for combinational symbols.
 *
 * @constructor
 * @param {?Array.<goog.structs.Set<string>>=} opt_sets Optional array of set.
 */
sia.secrets.CombinationalSymbols = function(opt_sets) {
  if (opt_sets) {
    goog.asserts.assertArray(opt_sets);
  }
  this.sets_ = opt_sets || [];
  this.isInputing_ = false;
};

/**
 * Resolves virtual symbols from an array of symbols sets.
 *
 * @param {Array.<goog.structs.Set.<string>>} comSymbols The sets of symbols.
 * @return {Array.<goog.structs.Map.<string, number>>} Pairs of symbols and
 *   each counts.
 */
sia.secrets.CombinationalSymbols.resolve = function(comSymbols) {
  return goog.array.map(comSymbols.sets_, function(set) {
    return sia.secrets.resolveSet(set);
  });
};


/**
 * Compares two combinational symbols.
 *
 * @param {Array.<goog.structs.Set.<string>>} a The sets of symbols to compare.
 * @param {Array.<goog.structs.Set.<string>>} b The sets of symbols to compare.
 * @return {boolean} Whether the combinational symbols were matched.
 */
sia.secrets.CombinationalSymbols.equals = function(a, b) {
  var resolvedA = sia.secrets.CombinationalSymbols.resolve(a);
  var resolvedB = sia.secrets.CombinationalSymbols.resolve(b);

  return goog.array.equals(resolvedA, resolvedB, function(mapA, mapB) {
    return mapA.equals(mapB);
  });
};


/**
 * Max count of symbols in a combinational symbol.
 * @const
 * @type {number}
 */
sia.secrets.CombinationalSymbols.MAX_COUNT = 4;


/**
 * Returns selializable (jsonable) object.
 *
 * @param {Array.<goog.structs.Set.<string>>} comSymbols Symbols set to
 *   selialize.
 * @param {boolean=} opt_resolve Whether enable to resolve. Default is not
 *   resolving.
 * @return {Array.<Array.<string>>} Selialized object.
 */
sia.secrets.CombinationalSymbols.prototype.toSerializable = function(
    opt_resolve) {
  if (opt_resolve) {
    var resolvedMaps = sia.secrets.CombinationalSymbols.resolve(this);
    return goog.array.map(resolvedMaps, function(map) {
      var symbols = map.getKeys();
      var resolvedSymbols = [];
      goog.array.forEach(symbols, function(symbol) {
        var count = map.get(symbol);
        for (var i = 0; i < count; i++) {
          resolvedSymbols.push(symbol);
        }
      });
      return resolvedSymbols;
    });
  }
  else {
    return goog.array.map(this.sets_, function(set) {
      return set.getValues();
    });
  }
};


/**
 * Clears a combinational symbols.
 */
sia.secrets.CombinationalSymbols.prototype.clear = function() {
  this.sets_ = [];
  this.isInputing_ = false;
};


/**
 * Returns a current set.
 *
 * @return {goog.structs.Set} set Current set.
 */
sia.secrets.CombinationalSymbols.prototype.getCurrentSet = function() {
  return goog.array.peek(this.sets_);
};



/**
 * Returns a count of symbols.
 * @return {number} Count of the symbols.
 */
sia.secrets.CombinationalSymbols.prototype.getCount = function() {
  return goog.array.reduce(this.sets_, function(res, set) {
    return res + set.getCount();
  }, 0);
};


/**
 * Returns a count of appended symbols without pusheds.
 * @return {number} Count of the symbols.
 */
sia.secrets.CombinationalSymbols.prototype.getAppendedCount = function() {
  return this.isInputing_ ? this.getCurrentSet().getCount() : 0;
};


/**
 * Whether a symbol was appended. Pushed symbols should not be evaluated.
 * @param {string} symbol The symbol to test.
 * @return {boolean} Whether the symbol was appended.
 */
sia.secrets.CombinationalSymbols.prototype.isAppended = function(symbol) {
  return this.isInputing_ && this.getCurrentSet().contains(symbol);
};


/**
 * Appends a symbol.
 *
 * @param {string} symbol The symbol to append.
 * @return {boolean} Whether the symbol was contained.
 */
sia.secrets.CombinationalSymbols.prototype.append = function(symbol) {
  if (this.getCount() < sia.secrets.CombinationalSymbols.MAX_COUNT) {
    if (!this.isInputing_) {
      this.isInputing_ = true;
      this.sets_.push(new goog.structs.Set());
    }
    this.getCurrentSet().add(symbol);
    return true;
  }
  return false;
};


/**
 * Removes a symbol.
 *
 * @param {string} symbol The symbol to remove.
 * @return {boolean} Whether the symbol was removed.
 */
sia.secrets.CombinationalSymbols.prototype.remove = function(symbol) {
  var set = this.getCurrentSet();

  if (set) {
    var result = set.remove(symbol);
    if (this.getAppendedCount() <= 0) {
      this.pop();
    }
    return result;
  }
  return false;
};


/**
 * Pushes an array of a simultaneous input.
 */
sia.secrets.CombinationalSymbols.prototype.push = function() {
  var MAX = sia.secrets.CombinationalSymbols.MAX_COUNT;
  var count = this.getCount();
  goog.asserts.assert(this.getAppendedCount() > 0,
      'Nothing to push. The count of current set was less than 0: ' + count);
  goog.asserts.assert(count <= MAX, 'The count was larger than the max: ' +
      count);

  this.isInputing_ = false;
};


/**
 * Pops an array of a simultaneous input.
 */
sia.secrets.CombinationalSymbols.prototype.pop = function() {
  this.sets_.pop();
  this.isInputing_ = false;
};


/**
 * Tests whether the given combinational symbols consists of the same symbols as
 * the combinational symbols.
 *
 * @param {sia.secrets.CombinationalSymbols} comSymbols Combinational symbols to
 *   test.
 * @return {boolean} True if the given combinational symbols consists of the
 *   same symbols as this combinational symbols.
 */
sia.secrets.CombinationalSymbols.prototype.equals = function(comSymbols) {
  return sia.secrets.CombinationalSymbols.equals(this, comSymbols);
};


/**
 * Creates a shallow clone of this combinational symbols.
 * @return {sia.secrets.CombinationalSymbols} A new combinational symbols
 *   containing all the same elements as this set.
 */
sia.secrets.CombinationalSymbols.prototype.clone = function() {
  return new sia.secrets.CombinationalSymbols(
      goog.array.map(this.sets_, function(set) {
        return set.clone();
    })
  );
};


/**
 * Whether a symbols set is empty.
 * @return {boolean} Whether the symbols set is empty.
 */
sia.secrets.CombinationalSymbols.prototype.isEmpty = function() {
  return this.getCount() <= 0;
};


/**
 * Whether a symbols set is full.
 * @return {boolean} Whether the symbols set is full.
 */
sia.secrets.CombinationalSymbols.prototype.isFull = function() {
  return this.getCount() >= sia.secrets.CombinationalSymbols.MAX_COUNT;
};


/**
 * Returns a JSON style string of the combinational symbols.
 * @param {boolean=} opt_resolve Whether enable to resolve. Default is not
 *   resolving.
 * @return {string} The string.
 */
sia.secrets.CombinationalSymbols.prototype.toString = function(opt_resolve) {
  return this.toSerializable(opt_resolve).map(function(arr) {
    return '(' + arr.join(' ') + ')';
  }).join(' ');
};
