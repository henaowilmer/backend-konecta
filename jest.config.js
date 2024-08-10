module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testMatch: ['**/tests/**/*.test.js'],
    testEnvironment: "node"
};
