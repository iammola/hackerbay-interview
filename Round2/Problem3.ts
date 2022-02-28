/* 
You have an array of N strings.

Eg: ["S>P","P>A","A>I","I>N"]

You need to combine these strings in an array to form a word.

OUTPUT:  SPAIN

Eg 2 : ["E>N", "P>E"]

Output: PEN

Eg 3: ["M>P","L>A","A>M"]

Output: LAMP

Note:
- The strings in an array can be in any random order.
  Eg: ["E>N", "P>E"] -> PEN
- Assume no letter in any word is repeated (You will never have two same letters in a word in any of the test cases)
*/

function getNext(input: string[]) {
  if (input.length === 1) return 0;
  const letters = input.join("").split(/>?/);

  return letters.findIndex(
    (letter) => letters.indexOf(letter) === letters.lastIndexOf(letter)
  );
}

function createWord(input: string[]) {
  const res = [];

  while (input.length) {
    const [letters] = input.splice(getNext(input), 1);

    if (res.length === 0) res.push(letters[0]);
    res.push(letters.slice(-1));
  }

  return res.join("");
}

console.log("Test:", ["S>P", "P>A", "A>I", "I>N"], "Result:", createWord(["S>P", "P>A", "A>I", "I>N"]), "Expected:", "SPAIN");
console.log("Test:", ["E>N", "P>E"], "Result:", createWord(["E>N", "P>E"]), "Expected:", "PEN");
console.log("Test:", ["M>P","L>A","A>M"], "Result:", createWord(["M>P","L>A","A>M"]), "Expected:", "LAMP");
