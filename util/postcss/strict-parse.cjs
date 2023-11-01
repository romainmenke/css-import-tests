let { Input } = require('postcss')

let StrictParser = require('./strict-parser.cjs')

module.exports = function strictParse(css, opts) {
	let input = new Input(css, opts)

	let parser = new StrictParser(input)
	parser.parse()

	return parser.root
}
