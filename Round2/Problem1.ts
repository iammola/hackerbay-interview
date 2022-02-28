/* Input is an array of Integers which denotes the stock value of company X.

Ex : [1,5,6,7,34,10]

In this case :
1 is the stock value of company X on Day 0.
5 is the stock value of company X on Day 1.
...
10 is the stock value of a company X on Day 5.

You need to find the day where I can buy the stock and day where I can sell the stock to get the max profit :

In the above case, If I buy the stock at Day 0 (i.e when the value is 1) and sell on Day 4 (when the value is 34). I get the max profit. Profit = 34-1 = 33. So, the output for the above example should be [0,4] (i.e [buy-day, sell-day])

If there is a test case in which any profit is not possible, Print [0,0] (i.e: you're buying and selling the stock on the same day)

Test Cases :
[200, 1,5,6,7,34,10]
[1,5,6,7,34,10,300]
[10,1,5,6,7,34,10,20]
[2,200,1,0,10]
[7,10]
[1] //Output: [0,0] You buy and sell on the same day because there's only one number.

If an empty array or null is passed as an input return [-1,-1].
*/

function findBestStock(input: number[] | null) {
  if (input === null || input.length === 0) return [-1, -1];
  if (input.length === 1) return [0, 0];

  const dayIndex = (ref: number) => input.findIndex((ins) => ins === ref);

  const min = Math.min(...input);
  const minIndex = dayIndex(min);

  const max = Math.max(...input.slice(minIndex));
  if (max === 0) return [0, 0];

  const maxIndex = dayIndex(max);

  return [minIndex, maxIndex];
}

console.log("// Problem 1");
console.log("Output: ", findBestStock([1]), "expected: [0, 0]");
console.log("Output: ", findBestStock(null), "expected: [0, 0]");
console.log("Output: ", findBestStock([7, 10]), "expected: [0, 0]");
console.log("Output: ", findBestStock([2, 200, 1, 0, 10]), "expected: [0, 0]");
console.log("Output: ", findBestStock([1, 5, 6, 7, 34, 10]), "expected: [0, 0]");
console.log("Output: ", findBestStock([200, 1, 5, 6, 7, 34, 10]), "expected: [0, 0]");
console.log("Output: ", findBestStock([1, 5, 6, 7, 34, 10, 300]), "expected: [0, 0]");
console.log("Output: ", findBestStock([10, 1, 5, 6, 7, 34, 10, 20]), "expected: [0, 0]");
