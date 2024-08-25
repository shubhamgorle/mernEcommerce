// Serach 
class ApiFeatures {
    // query ---> Product.find()
    // queryStr --->  req.query
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.query = this.query.find({ ...keyword })
        return this;
    }
    filter() {
        const queryCopy = {...this.queryStr}
        //  Removing Some Feild for category
        const removeFeilds = ["keyword", "page", "limit"];
        removeFeilds.forEach((key) => delete queryCopy[key]);
      
        // console.log("queryCopy",queryCopy)   output --> queryCopy { price: { gt: '1200', lt: '3300' } }
    //   Filter for price and rating
       let querystr = JSON.stringify(queryCopy)
    //   in mongodb we use $gt $lt for filtering but here we cnannot
    // pass $ in query parameters so we have to add that $ in gt lt etc
     querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`)
      
        this.query = this.query.find(JSON.parse(querystr))
        // console.log("querystr",querystr)  ---> output    querystr {"price":{"$gt":"1200","$lt":"3300"}}
        return this;
    }
    pagination(resultPerPage){
        const curPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage*(curPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}


module.exports = ApiFeatures

    