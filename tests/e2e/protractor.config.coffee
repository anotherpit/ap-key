exports.config =
    seleniumAddress: 'http://localhost:4444/wd/hub'
    multiCapabilities: [
        {'browserName': 'chrome'}
        {'browserName': 'firefox'}
        {'browserName': 'safari'}
    ]
    jasmineNodeOpts:
        showColors: true,
        defaultTimeoutInterval: 30000
