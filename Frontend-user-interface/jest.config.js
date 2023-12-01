module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    },
    testEnvironment: 'jsdom',
    testRegex: 'tests/.*\\.test\\.js$',
};
