/**
 * 返回一个a到b之间的随机数
 * @param a 
 * @param b 
 * @returns 
 */
const random = (a:number,b:number)=>{
 return Math.random()*(b-a) + a
}

export{
  random,
}