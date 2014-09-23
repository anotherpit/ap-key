(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = angular.module('anotherpit/apKey', ['ng']);


/**
 * @ngdoc service
 * @name apKey
 * @kind object
 * @description
 * Key mappings for ap-key directive: use keys from this map
 * to bind corresponding special keys, like spacebar
 */

module.exports.value('apKey', {
  'SPACE': ' ',
  'ENTER': String.fromCharCode(13)
});


/**
 * @ngdoc directive
 * @name apKey
 * @element ANY
 * @description
 * User-friendly analog of HTML 'accesskey' attribute:
 * triggers 'click' event on the element,
 * when user presses the given key (no weird modificators needed)
 * @param {string} apKey Key character
 */

module.exports.directive('apKey', [
  '$rootElement', 'apKey', function($rootElement, apKey) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var onKeyDown, root;
        root = element;
        while (!(root.attr('tabindex') || root[0] === $rootElement[0])) {
          root = root.parent();
        }
        onKeyDown = function(event) {
          var expectedKey, onKeyUp, pressedKey, which;
          if (event.metaKey || event.ctrlKey) {
            return;
          }
          which = event.which || event.keyCode;
          pressedKey = String.fromCharCode(which).toLowerCase();
          expectedKey = (apKey[attrs.apKey] || attrs.apKey).toLowerCase();
          if (pressedKey !== expectedKey) {
            return;
          }
          if (event.preventDefault) {
            event.preventDefault();
          }
          onKeyUp = function(event) {
            var click;
            if (which !== (event.which || event.keyCode)) {
              return;
            }
            root.off('keyup', onKeyUp);
            element[0].focus();
            click = new MouseEvent('click', {
              canBubble: true,
              cancelable: true,
              view: window
            });
            return element[0].dispatchEvent(click);
          };
          root.on('keyup', onKeyUp);
          element.on('$destroy', function() {
            return root.off('keyup', onKeyUp);
          });
        };
        root.on('keydown', onKeyDown);
        element.on('$destroy', function() {
          return root.off('keydown', onKeyDown);
        });
      }
    };
  }
]);



},{}]},{},[1])