var Express = require("express"),
    BodyParser = require("body-parser"),
    Http = require("http");

var webix = require("webix-nodejs");
var mongo = require("webix-mongo");

//configure db connection
var conn = webix.db(mongo, "mongodb://localhost:27017/webixdata");

//default express app
var app = Express();
app.set("port", 3000);
app.use(BodyParser.urlencoded({extended: false}));


/* Plain and hierarchical data */

//read-write data feed for plain data
app.all("/tasks", conn.crud("records"));
//read write data feed for hierarchical data
app.all("/treetasks", conn.crud("nestedrecords").asTree() );


/* Extra protocols */

//read only data feed
app.all("/readonly", conn.data("records"));
//read write data feed - rest protocol
app.all("/restdata", conn.rest("records"));
//read write data feed - connector protocol
app.all("/connectordata", conn.connector("records"));


/* Data mapping */

//select and rename in data feed
app.all("/custom", conn.map({
    firstname: name
}).data("records"));

//select only specified fields
app.all("/custom", conn.select([
    "firstname"
    "lastname"
]).data("records"));



/* Filtering, Validations, Custom Logic */

app.all("/activetasks", conn.data("records", function(state, result){
    //custom query
    result(state.db.find("status eq 'active'"));
}));
app.all("/activetasks", conn.crud("records", function(state){
    //validation
    if (!state.data.name) return false;
    //block deltee operatons
    if (state.operation == "delete") return false;

    //data altering before saving
    state.data.status = 'active';
    return true;
}));


//start server
Http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});