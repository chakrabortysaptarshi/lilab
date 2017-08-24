//http://stackoverflow.com/questions/5924072/express-js-cant-get-my-static-files-why
//http://stackoverflow.com/questions/22709882/how-to-suppress-application-logging-messages-from-a-node-js-application-when-run

var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var cors = require('cors');
/*var corsOptions = {
	credentials: true
}*/
var auth = require('./auth.js')();
var routes = require('./routes');
var modelDBRoutes = require('./modelDBRoutes');


var cpuStat = require('cpu-stat');
var memStat = require('mem-stat');
var database = require('./databaseFunctions');
//var si = require('systeminformation');

process.env.NODE_ENV = 'est';

app.use(cors({origin: true,credentials: true}));
app.use("/S3LabUploads",express.static('S3LabUploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(auth.initialize()); 
app.use('/',routes);
app.use('/',modelDBRoutes);


var server = app.listen(8889,function() {
   console.log('App listening on port 8889.'); 
});
var io= require('socket.io')(server);

//***** Socket.IO for Charts STARTS **********
var i=0;
var accTrn = [];
var accVal = [];
var lossTrn = [];
var lossVal = [];
var stubcounter = 0; //delete this line
io.on('connection', function(socket) {
	console.log('io.on connection');
	++i;
	socket.emit('news','hello world');
	socket.on('my other event', function(data) {
		console.log('my other event');
		cpuStat.usagePercent({
		    sampleMs: 10000,
		  },
		  function(err, percent, seconds) {
		    if (err) {
		      return console.log(err);
		    }

		    database.getAllEpochresult(function(err, result) {
				if(err != null) {
					response.status(400).send("unable to get dashboard!");
				}
				var a = parseFloat(Math.random()).toFixed(2);
				for(var i=0; i< result.rows.length; i++) {
					accTrn.push(result.rows[i].train_accuracy);
					accVal.push(result.rows[i].train_loss);
					lossTrn.push(result.rows[i].val_accuracy);
					lossVal.push(result.rows[i].val_loss);
				}

				var message = '{"kpi" : '+90+ ', "sec_ep" : '+result.rows[0].time_taken+ ', "batch" : '+ Math.round(a*380)+ ', "sam_s" : '+ a*2000 +', "CPU" : '+ Math.round(25) + 
				', "RAM": ' + 59+', "acTr": ['+ accTrn+'], "acVal": ['+ accVal+'], "lsTr": ['+ lossTrn+'], "lsVal": ['+ lossVal+']}'; 
				console.log(message);
				socket.emit('news',  JSON.parse(message));
			});

		    /*var a = parseFloat(Math.random()).toFixed(2); 
		    accTrn.push(a);
		    a = parseFloat(Math.random()).toFixed(2);
		    accVal.push(a);
		    a = parseFloat(Math.random()).toFixed(2);
		    lossTrn.push(a);
		    a = parseFloat(Math.random()).toFixed(2);
		    lossVal.push(a);

		    var usedPercent = Math.round(memStat.usedPercent());
			var message = '{"kpi" : '+(90+a*10)+ ', "sec_ep" : '+(11.5+a*10)+ ', "batch" : '+ Math.round(a*380)+ ', "sam_s" : '+ a*2000 +', "CPU" : '+ Math.round(percent) + ', "RAM": ' + usedPercent+', "acTr": ['+ accTrn+'], "acVal": ['+ accVal+'], "lsTr": ['+ lossTrn+'], "lsVal": ['+ lossVal+']}'; 
			console.log(message);
		    socket.emit('news',  JSON.parse(message));

		    console.log(usedPercent);
		    //the percentage cpu usage for core 0
		    console.log(Math.round(percent));i*/

		});
	});
}); 
//******* Socket.IO for Charts ENDS *********

