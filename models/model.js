var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Homes = new Schema({
    author    : ObjectId,
    title     : String,
    body      : String,
    date      : Date
});