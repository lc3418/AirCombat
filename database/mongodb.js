var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://admin:****@localhost:27017/nodedb?authSource=admin');
//revise above line to connect to the corresponding database with authorization

db.on('error',function(error){
	console.log(error);
});

var mongooseSchema=new mongoose.Schema({
	name:{type:String},
	password:{type:String},
	max_score:{type:Number}
});
mongooseSchema.methods.findByName=function(name,callback){
	return this.model('user').find({name:name},callback);
}
var mongooseModel=db.model('user',mongooseSchema);

module.exports=mongooseModel;