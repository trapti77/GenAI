//  WHAT IS DOTPRODUCT ?
// Formula of dot product
//how it find similarity :Ex.


//dotProduct -- it is used for finding similarity of object and give result based on similarity.
//              The dot product is a way to multiply two vectors and get a single number (scalar).
//              we use dot product to find similarity between to vector

//Formula  --dot product as similarity (Raw)
//for two vectors:
//                a=[a1,a2.......,an], b=[b1,b2.......,bn]
//the dot product is: a*b= n
//                         E ai*bi
//                         i=1

//This - bigger values mean more similarity .

//Example 1  a=[1,2,3] b=[2,4,6]

//           a*b= (1*2)+(2*4)+(3*6)=28

//Large positive number==high similarity means inke bech 28% similarity hai


// dotProduct = panda * Eelephant;
// dotProduct = parda * Tiger;

// dotProduct = (a1 * b1) + (a2 * b2);

//from graph value

// panda * Elephant=(0.75 * 0.50) + (0.22 * 0.80) == 0.551
// panda * Tiger=(0.75 * -0.28) + (0.22 * 0.70) == -0.256

//result btw panda and elephant  is large so the similarity is more than panda and tiger

//Lecture - 25

const panda = [0.75, 0.22];
const tiger = [-0.28, 0.70];

const data = panda.map((item, index) => {
    return panda[index] * tiger[index];
});

const ans=data.reduce((ele, sum) =>sum+ele)

console.log(ans);


