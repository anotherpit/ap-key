module.exports = angular.module('anotherpit/apKey', ['ng'])

###*
# @ngdoc service
# @name apKey
# @kind object
# @description
# Key mappings for ap-key directive: use keys from this map
# to bind corresponding special keys, like spacebar
###
module.exports.value 'apKey',
    'SPACE': ' ',
    'ENTER': String.fromCharCode(13)


###*
# @ngdoc directive
# @name apKey
# @element ANY
# @description
# User-friendly analog of HTML 'accesskey' attribute:
# triggers 'click' event on the element,
# when user presses the given key (no weird modificators needed)
# @param {string} apKey Key character
###
module.exports.directive 'apKey', ['$rootElement', 'apKey', ($rootElement, apKey) ->
    restrict: 'A',
    link: (scope, element, attrs) ->

        # Search upwards for first focusable element within $rootElement
        root = element
        until root.attr('tabindex') || root[0] is $rootElement[0]
            root = root.parent()

        onKeyDown = (event) ->
            # Skip when modificators
            return if event.metaKey or event.ctrlKey

            # Compare pressed and expected keys
            which = (event.which or event.keyCode)
            pressedKey = String.fromCharCode(which).toLowerCase()
            expectedKey = (apKey[attrs.apKey] or attrs.apKey).toLowerCase()
            return if pressedKey isnt expectedKey

            # Prevent default
            event.preventDefault() if event.preventDefault

            onKeyUp = (event) ->
                return if which isnt (event.which or event.keyCode)
                root.off 'keyup', onKeyUp

                # Focus
                element[0].focus()

                # Click
                click = new MouseEvent 'click',
                    canBubble: true
                    cancelable: true
                    view: window
                element[0].dispatchEvent(click)

            # Bind keyup
            root.on 'keyup', onKeyUp
            element.on '$destroy', ->
                root.off 'keyup', onKeyUp

            return

        # Bind keydown
        root.on 'keydown', onKeyDown
        element.on '$destroy', ->
           root.off 'keydown', onKeyDown

        return
]

