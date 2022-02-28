/* 
Flatten this array out : [1,2,[3,4,[5,6],7,[8,9]]]
Output should be [1,2,3,4,5,6,7,8,9]

You can ONLY use arr.push(), arr.concat() as library / array functions. Please don't use any other library or array functions.
*/

type Input = number | number[] | Input[];

function flattenArray(input: Input[]) {
  let res: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const element = input[i];

    if (typeof element === "number") res.push(element);
    else res = res.concat(flattenArray(element));
  }

  return res;
}

console.log("Test: ", [1, 2, [3, 4, [5, 6], 7, [8, 9]]], "Result:", flattenArray([1, 2, [3, 4, [5, 6], 7, [8, 9]]]), "Expected:", [1, 2, 3, 4, 5, 6, 7, 8, 9])
