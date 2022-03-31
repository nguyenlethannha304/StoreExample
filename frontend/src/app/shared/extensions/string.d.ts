// Add rsplit() to String
export {};
declare global {
  interface String {
    rsplit(separator: string, maxSplit?: number): Array<string>; //Right Split similar to rsplit() Python
  }
}

// String.prototype.rsplit = function (
//   separator: string,
//   maxSplit: number = 0
// ): Array<string> {
//   let textArray = this.split(separator);
//   let arrayLength = textArray.length;
//   if (arrayLength == 1 || maxSplit >= arrayLength) {
//     return textArray;
//   }
//   if (maxSplit) {
//     let result = [
//       textArray.slice(0, arrayLength - maxSplit + 1).join(separator),
//     ];
//     for (let i = 1; i <= maxSplit - 1; i++) {
//       result = result.concat(textArray[arrayLength - maxSplit + i]);
//     }
//     return result;
//   } else {
//     //   Array['startString to lastSeparator', 'lastSeparator to endString']
//     return [textArray.slice(0, arrayLength - 1).join('@')].concat(
//       textArray[arrayLength - 1]
//     );
//   }
// };
