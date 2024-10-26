let _tokenizer = require('@csstools/css-tokenizer').tokenizer

module.exports = function tokenizer(input, options = {}) {
	let returned = [];

	let _t = _tokenizer(input);

	function endOfFile() {
		return returned.length === 0 && _t.endOfFile()
	}

	function nextToken() {
		if (returned.length) return returned.pop()
		
		return _t.nextToken();
	}

	function back(token) {
		returned.push(token)
	}

	return {
		back,
		nextToken,
		endOfFile
	}
}
