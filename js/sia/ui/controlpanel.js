// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview The script for a backspace key for SIA (Simultaneous Inputable
 *   Authentication).
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('sia.ui.ControlPanel');
goog.provide('sia.ui.ControlPanel.ButtonMsg');
goog.provide('sia.ui.ControlPanel.EventType');
goog.provide('sia.ui.ControlPanel.SymbolType');
goog.require('goog.debug.LogManager');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Control');
goog.require('goog.ui.NativeButtonRenderer');
goog.require('sia.debug');



/**
 * A class for control panel.
 *
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *   document interaction.
 * @constructor
 * @extends {goog.ui.Control}
 */
sia.ui.ControlPanel = function(opt_renderer, opt_domHelper) {
  goog.base(this, null, opt_renderer, opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.ALL, false);
};
goog.inherits(sia.ui.ControlPanel, goog.ui.Control);


/**
 * Common event type.
 * @enum {string}
 */
sia.ui.ControlPanel.EventType = {
  START: 'controlstart'
};


/**
 * Symbol image type.
 * @enum {string}
 */
sia.ui.ControlPanel.SymbolType = {
  KEY: 0,
  WRONG: 1,
  CORRECT: 2,
  PADLOCK: 3
};


/**
 * Button messages.
 * @enum {string}
 */
sia.ui.ControlPanel.ButtonMsg = {
  SET: 'Set an authenticator',
  TEST: 'Authenticate',
  OK: 'OK'
};


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.CSS_CLASS = goog.getCssName('sia-panel-control');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.CORRECT_ANS_CSS_CLASS = goog.getCssName(
    'sia-answer-correct');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.LAST_ANS_CSS_CLASS = goog.getCssName('sia-answer-last');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.ANS_VAL_CSS_CLASS = goog.getCssName('sia-answer-value');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.START_BUTTON_CSS_CLASS = goog.getCssName(
    'sia-button-start');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.SYMBOL_CONTAINER_CSS_CLASS = goog.getCssName(
    'sia-symbol-container');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.CORRECT_SYMBOL_CSS_CLASS = goog.getCssName(
    'sia-symbol-correct');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.WRONG_SYMBOL_CSS_CLASS = goog.getCssName(
    'sia-symbol-wrong');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.KEY_SYMBOL_CSS_CLASS = goog.getCssName('sia-symbol-key');


/**
 * @const
 * @type {string}
 */
sia.ui.ControlPanel.PADLOCK_SYMBOL_CSS_CLASS = goog.getCssName(
    'sia-symbol-padlock');


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.correctAnswerElement_;


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.lastAnswerElement_;


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.correctSymbolElement_;


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.wrongSymbolElement_;


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.keySymbolElement_;


/**
 * @private
 * @type {Element}
 */
sia.ui.ControlPanel.prototype.padlockSymbolElement_;


/**
 * Sets a value to an element for a correct answer.
 * @param {sia.secrets.CombinationalSymbols} val Correct symbols to set.
 */
sia.ui.ControlPanel.prototype.setCorrectAnswer = function(val) {
  if (val.getCount()) {
    goog.dom.classes.enable(this.correctAnswerElement_, goog.getCssName(
          sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, 'undefined'), false);
    goog.dom.setTextContent(this.correctAnswerElement_, val.toString(true));
  }
  else {
    goog.dom.classes.enable(this.correctAnswerElement_, goog.getCssName(
          sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, 'undefined'), true);
    goog.dom.setTextContent(this.correctAnswerElement_, 'undefined');
  }
};


/**
 * Sets a value to an element for a last answer.
 * @param {sia.secrets.CombinationalSymbols} val Last symbols to set.
 */
sia.ui.ControlPanel.prototype.setLastAnswer = function(val) {
  if (val.getCount()) {
    goog.dom.classes.enable(this.lastAnswerElement_, goog.getCssName(
          sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, 'undefined'), false);
    goog.dom.setTextContent(this.lastAnswerElement_, val.toString(true));
  }
  else {
    goog.dom.classes.enable(this.lastAnswerElement_, goog.getCssName(
          sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, 'undefined'), true);
    goog.dom.setTextContent(this.lastAnswerElement_, 'undefined');
  }
};


/** @override */
sia.ui.ControlPanel.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  var dom = this.getDomHelper();

  var correctAnsContainer = this.getElementByClass(
      sia.ui.ControlPanel.CORRECT_ANS_CSS_CLASS);

  var lastAnsContainer = this.getElementByClass(
      sia.ui.ControlPanel.LAST_ANS_CSS_CLASS);

  var symbolContainer = this.getElementByClass(
      sia.ui.ControlPanel.SYMBOL_CONTAINER_CSS_CLASS);

  this.correctSymbolElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.CORRECT_SYMBOL_CSS_CLASS, symbolContainer);

  this.wrongSymbolElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.WRONG_SYMBOL_CSS_CLASS, symbolContainer);

  this.keySymbolElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.KEY_SYMBOL_CSS_CLASS, symbolContainer);

  this.padlockSymbolElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.PADLOCK_SYMBOL_CSS_CLASS, symbolContainer);

  this.correctAnswerElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, correctAnsContainer);

  this.lastAnswerElement_ = dom.getElementByClass(
      sia.ui.ControlPanel.ANS_VAL_CSS_CLASS, lastAnsContainer);

  var buttonElement = this.getElementByClass(
      sia.ui.ControlPanel.START_BUTTON_CSS_CLASS);

  var button = this.startButton_ = new goog.ui.Button(null,
      new goog.ui.NativeButtonRenderer(), dom);

  this.addChild(button);
  button.decorate(buttonElement);
};


/** @override */
sia.ui.ControlPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.setSymbolVisible(sia.ui.ControlPanel.SymbolType.KEY);
  this.getHandler().
    listen(this.startButton_, goog.ui.Component.EventType.ACTION,
        this.handleButtonClick).
    listen(this.getElement(), goog.object.getValues(goog.events.EventType),
        this.propagetionStopper);
};


/** @override */
sia.ui.ControlPanel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.correctAnswerElement_;
  delete this.lastAnswerElement_;
  delete this.correctSymbolElement_;
  delete this.wrongSymbolElement_;
  delete this.keySymbolElement_;
  delete this.padlockSymbolElement_;
};


/**
 * Sets a string to a button.
 * @param {sia.ui.ControlPanel.ButtonMsg} msg Button message.
 */
sia.ui.ControlPanel.prototype.setButtonMsg = function(msg) {
  this.startButton_.setContent(msg);
};


/**
 * Set a symbol visible.
 * @param {sia.ui.ControlPanel.SymbolType} type Symbol type to visible.
 */
sia.ui.ControlPanel.prototype.setSymbolVisible = function(type) {
  switch (type) {
    case sia.ui.ControlPanel.SymbolType.CORRECT:
      goog.style.showElement(this.correctSymbolElement_, true);
      goog.style.showElement(this.wrongSymbolElement_, false);
      goog.style.showElement(this.keySymbolElement_, false);
      goog.style.showElement(this.padlockSymbolElement_, false);
      break;
    case sia.ui.ControlPanel.SymbolType.WRONG:
      goog.style.showElement(this.correctSymbolElement_, false);
      goog.style.showElement(this.wrongSymbolElement_, true);
      goog.style.showElement(this.keySymbolElement_, false);
      goog.style.showElement(this.padlockSymbolElement_, false);
      break;
    case sia.ui.ControlPanel.SymbolType.KEY:
      goog.style.showElement(this.correctSymbolElement_, false);
      goog.style.showElement(this.wrongSymbolElement_, false);
      goog.style.showElement(this.keySymbolElement_, true);
      goog.style.showElement(this.padlockSymbolElement_, false);
      break;
    case sia.ui.ControlPanel.SymbolType.PADLOCK:
      goog.style.showElement(this.correctSymbolElement_, false);
      goog.style.showElement(this.wrongSymbolElement_, false);
      goog.style.showElement(this.keySymbolElement_, false);
      goog.style.showElement(this.padlockSymbolElement_, true);
      break;
    default:
      goog.asserts.fail('Illegal symbol type: ' + type);
  }
};


/**
 * Handles a start button event.
 * @param {goog.events.Event} e Click event to handle.
 * @protected
 */
sia.ui.ControlPanel.prototype.handleButtonClick = function(e) {
  this.dispatchEvent(sia.ui.ControlPanel.EventType.START);
  event.stopPropagation();
};


/**
 * Stop a propagation.
 * @param {goog.events.Event} e Event to handle.
 * @protected
 */
sia.ui.ControlPanel.prototype.propagetionStopper = function(e) {
  e.stopPropagation();
};


/**
 * Prevents default.
 * @param {goog.events.Event} e Event to handle.
 * @protected
 */
sia.ui.ControlPanel.prototype.defaultPreventer = function(e) {
  e.preventDefault();
};
