//slice() - иммутабельным

// const { ResultWithContextImpl } = require("express-validator/lib/chain");

// //arr.slice(откуда отрезать, докуда мы отрезаем)

// //1)

// const arr = ['a', 'b', 'c', 'd', 'e'];
// arr = [...arr, 'g']
// console.log('arr',  arr)
// const sub = arr.slice(0, 2); //второй параметр (не включительно берется)

// console.log('arr: ', arr);//arr:  [ 'a', 'b', 'c', 'd', 'e' ]
// console.log('sub: ', sub);//sub:  [ 'a', 'b' ]

//2)

// let arr = ['a', 'b', 'c', 'd', 'e'];
// let sub = arr.slice(2);

// console.log('sub: ', sub);//sub:  [ 'c', 'd', 'e' ]

//3

// let arr = ['a', 'b', 'c', 'd', 'e'];
// const copyArr = arr.slice();

// console.log('copyArr: ', copyArr);//copyArr:  [ 'a', 'b', 'c', 'd', 'e' ]
// console.log('isEqual: ', arr === copyArr);//isEqual:  false

//4
// let arr = ['a', 'b', 'c', 'd', 'e'];
// const sub = arr.slice(1, -1);

// console.log('sub: ', sub);//sub:  [ 'b', 'c', 'd' ]

//5

// let arr = ['a', 'b', 'c', 'd', 'e'];
// const sub = arr.slice(1, 4);

// console.log(sub);

//6

// const arr = ['a', 'b', 'c', 'd', 'e'];
// const sub = arr.slice(-2);

// console.log(sub);//[ 'd', 'e' ]

//splice() - мутабельным

//arr.splice( с какого индекса удаляем, кол-во элементов которых мы хотим удалить, вставляем элемень, вставляем элемент ...)

//1

// const arr = ['a', 'b', 'c', 'd', 'e'];
// const res = arr.splice(1, 3);

// console.log('arr: ', arr);//arr:  [ 'a', 'e' ]
// console.log('res: ', res);//res:  [ 'b', 'c', 'd' ]

//2

// const arr = ['a', 'b', 'c', 'd', 'e'];
// const res = arr.splice(2, 0, 'test value1', 'test value2');

// console.log('arr: ', arr); //arr:  [ 'a', 'b', 'test value1', 'test value2', 'c', 'd', 'e' ]
// console.log('res: ', res); //res:  []

//3
// const arr = ['a', 'b', 'c', 'd', 'e'];
// const res = arr.splice(1, 1, 'new item');

// console.log('arr: ', arr);//arr:  [ 'a', 'new item', 'c', 'd', 'e' ]
// console.log('res: ', res);//res:  [ 'b' ]

//toSpliced()

// const arr = ['Jan', 'March', 'Apr', 'May'];

// const newMonths = arr.toSpliced(1, 0, 'Feb');// ["Jan", "Feb", "March", "Apr", "May"]

//reduce()

// let a = [1, 2, 3, 4, 5];
// let sum = 0;

// for (let i = 0; i < a.length; i++) {
//   sum = sum + a[i];
// }

// console.log('sum: ', sum);//sum:  15

//arr.reduce(function (acc, el, index) {}, 0)//по дефолту это нулевое элемент массива arr[0]

//1

// let a = [1, 2, 3, 4, 5];

// let res = a.reduce(function (acc, currentNumber) {
//   //   console.log('acc: ', acc);
//   //   console.log('currentNumber: ', currentNumber);

//   return acc + currentNumber;
// }, 0);

// console.log('res: ', res);//res:  15

//2

// const fruits = [
//   { name: 'apple', quantity: 2 },
//   { name: 'banana', quantity: 3 },
//   { name: 'orange', quantity: 1 },
// ]; //  на выходе хочу чтобы было число

// const result = fruits.reduce((acc, product) => acc + product.quantity, 0); // acc: 0, acc: 2, acc: 5, acc: 6
// console.log('result: ', result); //result:  6

//3
// const numbers = [5, 2, 8, 1, 6];
// // let maxNumber = numbers[0]

// //find Max Number value
// const result = numbers.reduce((acc, currentNumber) => {
//   console.log('acc: ', acc);
//   console.log('currentNumber: ', currentNumber);

//   return currentNumber > acc ? currentNumber : acc;
// });

// console.log('result', result);//8

//4

// const people = [
//   { name: 'Alice', age: 25 },
//   { name: 'Bob', age: 30 },
//   { name: 'Charlie', age: 22 },
// ]; // Expected result: {totalNames: ["Alice", "Bob", "Charlie"], totalAge: summaryAge(this is number)}

// const result = people.reduce(
//   (acc, currentPeople) => {
//     console.log('currentPeople', currentPeople); // каждый раз будем получать объект

//     acc.totalNames.push(currentPeople.name);
//     acc.totalAge = acc.totalAge + currentPeople.age;
//     return acc;
//   },
//   { totalNames: [], totalAge: 0 }
// );

// console.log('result: ', result); //result:  { totalNames: [ 'Alice', 'Bob', 'Charlie' ], totalAge: 77 }

//5

// const people = [
//   { name: 'Alice', age: 25, isStudent: true },
//   { name: 'Bob', age: 30, isStudent: false },
//   { name: 'Charlie', age: 22, isStudent: true },
// ]; // Expected result: {totalNames: ["Alice", "Bob", "Charlie"], totalAge: summaryAge(this is number)}

// const mappedInfo = people.map((currentPeople) => ({
//   name: currentPeople.name,
//   age: currentPeople.age,
// }));

// console.log('mappedInfo: ', mappedInfo); //mappedInfo:  [
// //     { name: 'Alice', age: 25 },
// //     { name: 'Bob', age: 30 },
// //     { name: 'Charlie', age: 22 }
// //   ]

// const combinedObj = {
//   totalName: mappedInfo.map((person) => person.name), // map -> return new array
//   totalAge: mappedInfo.reduce((acc, currentPerson) => acc + currentPerson.age, 0),
// };

// console.log('combinedObj: ', combinedObj);//combinedObj:  { totalName: [ 'Alice', 'Bob', 'Charlie' ], totalAge: 77 }

// [+, +, +] => [-, -, -]

//1
// const peoples = [
//   { name: 'Vika', age: 25, budget: 4500 },
//   { name: 'Nikita', age: 45, budget: 35000 },
//   { name: 'Igor', age: 55, budget: 340 },
//   { name: 'Insaf', age: 65, budget: 50000 },
//   { name: 'Alyona', age: 75, budget: 20 },
// ]; // summayBudget  - 35000

// const res = peoples.reduce((acc, currentPeople) => acc + currentPeople.budget, 0);
// console.log(res);//89860

//2
// const numbers = [5, 6, 7, 8, 9, 10, -199]; // find minNumber
// const minNumber = numbers.reduce((acc, number) => (acc > number ? number : acc));

// console.log(minNumber); //-199

//3
// const peoples = [
//   { name: 'Vika', age: 25, budget: 4500 },
//   { name: 'Nikita', age: 45, budget: 35000 },
//   { name: 'Igor', age: 55, budget: 340 },
//   { name: 'Insaf', age: 65, budget: 50000 },
//   { name: 'Alyona', age: 75, budget: 20 },
// ]; // {names: ["Vika", "nikita" and etc...]}

// const peopleNames = peoples.reduce(
//   (acc, currentPeople) => {
//     acc.names.push(currentPeople.name);
//     return acc;
//   },
//   { names: [] }
// );

// console.log(peopleNames); //{ names: [ 'Vika', 'Nikita', 'Igor', 'Insaf', 'Alyona' ] }

//

// const words = ['Hello', ' ', 'world', '!']; // "Hello world!"
// const str = words.reduce((acc, currentWord) => acc + currentWord, '');

// console.log('str: ', str);//str:  Hello world!

//-------------------------------------------------------------------------------------------
// function replaceMultipleElements(arr, index, count, newElements) {
//     arr.splice(index, count, ...newElements)
//     return arr;
// }
  
//   console.log(replaceMultipleElements([1, 2, 3, 4, 5], 1, 3, [10, 20])); 
  // Ожидаемый результат: [1, 10, 20, 5]
  
  const tmpIn1 = { 
      name: 'Vika', 
      age: 25, 
      distance: 30,
      budget: 4500,
      sex: 'female' 
    }

    const tmpIn2 = { 
      name: 'Ira', 
      age: 15, 
      budget: 4500,
    }
  
  const tmpOut = {...tmpIn1, ...tmpIn2};
  
  
  console.log('tmpIn1 = ', tmpIn1)
  console.log('tmpIn2 = ', tmpIn2)

  console.log('tmpOut = ', tmpOut)

