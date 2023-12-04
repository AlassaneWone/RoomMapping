module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: 'jsdom',
    testRegex: 'tests/.*\\.test\\.js$',
    // The glob patterns Jest uses to detect test files
    testMatch: [
        "**/tests/**/*.[jt]s?(x)", 
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
};

