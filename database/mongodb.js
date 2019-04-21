var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://127.0.0.1:27017/AirCombat_local_test');
db.on('error',function(error){
	console.log(error);
});

var mongooseSchema=new mongoose.Schema({
	name:{type:String},
	password:{type:String}
});
mongooseSchema.methods.findByName=function(name,callback){
	return this.model('user').find({name:name},callback);
}
var mongooseModel=db.model('user',mongooseSchema);

module.exports=mongooseModel;