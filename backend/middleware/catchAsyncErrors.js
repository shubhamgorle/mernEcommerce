
// module.exports = (theFunc)=>(req,res,next)=>{
//     Promise.resolve(theFunc(req,res,next)).catch(next);
// };

const theFunc = (theFunc)=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}
module.exports = theFunc


// note ---> while creating the new product if we ser some keys are required in schema like name or price and while creating new
// product we did'nt provide this required keys then server will try to find required keys but it will not get and server continuously try to find 
// it and never retrun anything will tends to generate server error to overcome such error we are using above function theFunc ie "catchAsyErrors" !