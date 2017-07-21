module.exports = {
	"extends": "airbnb",
  "parser": "babel-eslint",
	"rules": {
    "react/prop-types": 0,
    "comma-dangle": ["error", "never"],
    "max-len": 0,
    "react/no-danger": 0,
    "react/no-string-refs": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "no-param-reassign": 0,
    "no-loop-func": 0,
    "no-extend-native": 0,
	},
	"globals": {
		"document": true,
		"window": true,
    "sessionStorage": true
	}
}
