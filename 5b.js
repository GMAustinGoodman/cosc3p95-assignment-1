//reproduce the python code
function processString(string) {
	return string.split('').map(char => {
		if (/\d/.test(char))
			return char + char;
		else if (char === char.toLowerCase())
			return char.toUpperCase();
		else if (char === char.toUpperCase())
			return char.toLowerCase();
		return char;
	}).join("")
}

//corrected version
function processStringCorrected(string) {
	return string.split('').map(char => {
		if (char === char.toLowerCase())
			return char.toUpperCase();
		else if (char === char.toUpperCase())
			return char.toLowerCase();
		return char;
	}).join("")
}

function test(string) {
	return processString(string) === processStringCorrected(string);
}

function deltaDebug(input, testFunction) {
	//base case
	if (input.length === 1) {
		return input;
	}

	//split input in half
	let splitIndex = Math.floor(input.length / 2);
	let firstHalf = input.slice(0, splitIndex);
	let secondHalf = input.slice(splitIndex);

	//test the halves
	const firstHalfResult = testFunction(firstHalf);
	const secondHalfResult = testFunction(secondHalf);

	//when both results fail, recurse with the smaller half
	if (!firstHalfResult && !secondHalfResult) {
		if (firstHalf.length < secondHalf.length) {
			return deltaDebug(firstHalf, testFunction);
		} else {
			return deltaDebug(secondHalf, testFunction);
		}
	}
	//recurse with left if possible
	if (!firstHalfResult) {
		return deltaDebug(firstHalf, testFunction);
	}
	//recurse with right if possible
	if (!secondHalfResult) {
		return deltaDebug(secondHalf, testFunction);
	}
}

console.log(deltaDebug("abcdefG1", test))
console.log(deltaDebug("CCDDEExy", test))
console.log(deltaDebug("1234567b", test))
console.log(deltaDebug("8665", test))