module.exports = {
  "extends": [
    "airbnb",
    "plugin:react-hooks/recommended"
  ],
  "env": {
    "browser": true,
  },
  "plugins": [
    "react",
    "react-hooks",
    "jsx-a1y",
    "import"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn"
  }
};