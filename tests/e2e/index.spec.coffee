# [SublimeLinter coffeelint-x2]
describe 'E2E', ->
    root = false
    items = false

    beforeEach ->
        browser.get './index.html'
        root = element By.css 'body'
        items = element.all By.css 'li'

    it 'should fire click on A button when A pressed', ->
        root.sendKeys 'a'
        expect(items.count()).toEqual(1)
        expect(items.get(0).getText()).toEqual('a')

    it 'should not fire click on A button when Cmd/Ctrl+A pressed', ->
        root.sendKeys protractor.Key.COMMAND, 'a', protractor.Key.NULL
        expect(items.count()).toEqual(0)
        root.sendKeys protractor.Key.CONTROL, 'a', protractor.Key.NULL
        expect(items.count()).toEqual(0)

    it 'should fire click on both S buttons when S pressed', ->
        root.sendKeys 's'
        expect(items.count()).toEqual(2)
        expect(items.get(0).getText()).toEqual('s2')
        expect(items.get(1).getText()).toEqual('s1')

    it 'should not fire click on disabled D button when D pressed', ->
        root.sendKeys 'd'
        expect(items.count()).toEqual(0)

    it 'should not fire click on SPACE button when spacebar pressed', ->
        root.sendKeys protractor.Key.SPACE
        expect(items.count()).toEqual(1)
        expect(items.get(0).getText()).toEqual('SPACE')

    it 'should not fire click on ENTER button when enter pressed', ->
        root.sendKeys protractor.Key.ENTER
        expect(items.count()).toEqual(1)
        expect(items.get(0).getText()).toEqual('ENTER')

    return