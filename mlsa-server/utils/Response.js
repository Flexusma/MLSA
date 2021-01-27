
exports.Resp = class Response{
    static respOK(res,data){
        res.status(200).json({
            data:data,
            message:"Request handled successfully",
            code: 200,
        });
    }

    static respError(res,err, error){
        res.status(err.code).json({
            message:err.message,
            code: err.code,
            error:error
        });
    }

}
