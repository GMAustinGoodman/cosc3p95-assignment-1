const fs = require('fs')

//write a log file file containing the input, expected, actual, and result
function writeLog(fileName, input, expected, actual, result) {
	//path file will be written to
	const filePath = `./2a-logs/${fileName}.txt`

	//delete existing file if it exists
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath)
	}

	//write data to the log file
	fs.writeFileSync(filePath, `input: ${input}\nexpected: ${expected}\nactual: ${actual}\nresult: ${result}`)
}

//simple bubble sort
function sort(data) {
	let dataCopy = data.slice()

	for (let i = 0; i < dataCopy.length; i++) {
		for (let j = 0; j < dataCopy.length - i - 1; j++) {
			if (dataCopy[j] > dataCopy[j + 1]) {
				let tmp = dataCopy[j]
				dataCopy[j] = dataCopy[j + 1]
				dataCopy[j + 1] = tmp
			}
		}
	}

	return dataCopy
}

//random value between min and max
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

//generator function that yields incrementing random numbers to ensure sorted random array
function* incrementingRandomGenerator(min, max, iterationCount) {
	//never generate a number greater than this. Forces small numbers to be generated first
	let effectiveMax = min + Math.floor(0.2 * (max - min))

	//never generate a number less than this. Forces generated numbers to be incrementing
	let effectiveMin = min

	//generate a random number between effectiveMin and effectiveMax 
	let index = 0
	while (index < iterationCount) {
		let random = getRandom(effectiveMin, effectiveMax)

		//yield the random number
		yield random

		//new effective min is the number we just generated (inclusive so it can be generated again)
		effectiveMin = random

		//new effective max is the previous effective max + 1, never exceeding the actual max
		effectiveMax = Math.min(effectiveMax + 1, max + 1)

		//increment the index
		index++
	}
}

//scramble an array to unsort it
function scrambleArray(array) {
	const arrCopy = array.slice()

	//swap each element with a random element
	for (let i = 0; i < arrCopy.length; i++) {
		let randomIndex = getRandom(0, arrCopy.length)
		let tmp = arrCopy[i]
		arrCopy[i] = arrCopy[randomIndex]
		arrCopy[randomIndex] = tmp
	}

	return arrCopy
}

//deep equality check for arrays
function arraysAreEqual(a, b) {
	return (a.length == b.length) && a.every(function (element, index) {
		return element === b[index];
	});
}

//generate an array of random numbers for testing of sort algorithm
function generateRandomTest(arraySizeMin, arraySizeMax, minValue, maxValue) {
	//will hold the generated test data
	let sortedTestData = []

	//pick a random array size and generate test data using generator function
	let arraySize = getRandom(arraySizeMin, arraySizeMax)
	const incrementingRandom = incrementingRandomGenerator(minValue, maxValue, arraySize)
	for (let i = 0; i < arraySize; i++) {
		sortedTestData.push(incrementingRandom.next().value)
	}

	//scramble the array to unsort it
	let scrambledTestData = scrambleArray(sortedTestData)

	//return the test data
	return { input: scrambledTestData, expected: sortedTestData }
}

//generate an array of random tests
function generateTests() {
	const tests = []

	//empty array
	tests.push({ input: [], expected: [] })

	//single element array
	tests.push({ input: [1], expected: [1] })

	//two element array
	tests.push({ input: [2, 1], expected: [1, 2] })

	//array with all the same element
	tests.push({ input: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], expected: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] })

	//array with two of the same element
	tests.push({ input: [3, 4, 4, 9, 15, -3], expected: [-3, 3, 4, 4, 9, 15] })

	//small numbers
	tests.push(generateRandomTest(3, 10, 0, 9))

	//large numbers
	tests.push(generateRandomTest(50, 100, 0, 9007199254740991))

	//negative numbers
	tests.push(generateRandomTest(3, 10, -9, 9))

	//large negative numbers
	tests.push(generateRandomTest(100, 500, -9007199254740991, 9007199254740991))

	//large array
	tests.push(generateRandomTest(5000, 10000, 0, 9007199254740991))

	//return the tests
	return tests
}

//generate tests and run them
function testSort() {
	const tests = generateTests()

	for (let test of tests) {
		let index = tests.indexOf(test)
		let input = test.input
		let expected = test.expected
		let actual = sort(input)
		let result = arraysAreEqual(actual, expected)

		writeLog(`test-${index}`, input, expected, actual, result)
	}
}

//entry point for program
testSort()