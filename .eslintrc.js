module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-set-state": "off",
        "class-methods-use-this": "off",
        "no-underscore-dangle": ["error", { "allow": ["foo_", "_bar"] }],
        "no-useless-constructor" : "off"
     }
};