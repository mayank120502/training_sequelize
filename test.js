// // const a = [{name:"abc" , age: 21},
// // {name:"def" , age: 21},
// // {name:"ghi" , age: 21},
// // {name:"jkl" , age: 21},]

// // console.log(Object.keys(a[0]));

// // function add(Name , Age){
// //     const [name , age] = [Name , Age];
// //     a.push({name , age});
// // }
// // add(1,2);
// // add(1,2);
// // add(1,2);
// // console.log(a);

// let arr = [];
// function obj(firstName, lastName , age) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.age = age
// }

//   arr.push(new obj('a' , 'b' , 1));
//   arr.push(new obj('c' , 'd' , 2));
//   arr.push(new obj('e' , 'f' , 3));
//   arr.push(new obj('g' , 'h' , 4));
//   arr.push(new obj('i' , 'j' , 5));
//   console.log(arr);
// const jwt = require('jsonwebtoken');

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1N2Q2NTAzLTliMDYtNDc3Yi05ZGFhLTViOThkZDZiNzIxYiIsImVtYWlsIjoibWF5YW5ramFpbjEyNW1qQGdtYWlsLmNvbSIsImlhdCI6MTY5Mjg3ODg4NywiZXhwIjoxNjkyODc4ODg4fQ.1JMn3sQMv62CbQSRN17vlbfxZa7Q2GaEhz6InLueWqI';

// console.log(jwt.verify(token , '1234'));