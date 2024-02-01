//Without a defined mathcher, thsi one line applies next-autth 
//To the entire project

export {default } from 'next-auth/middleware'

//Matcher 
export const config = { matcher: ["/catalog", "/companies/:path*" ] };