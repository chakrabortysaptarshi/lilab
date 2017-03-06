var path = require('path')
var uuid = require('node-uuid')
//spawn child process for training and testing 
var spawn = require('child_process').spawn,
		py    = spawn('python', [path.join(__dirname,'/S3LabUploads','/newTest.py')], {cwd:path.join(__dirname,"/S3LabUploads")});
var job_id = uuid.v4();
//store model path for sending later 
data = '{"width":"28","height":"28","nClass":"10","alpha":"0.01","File Name":"MNIST_data","modelID":"tempID"}'

py.stdin.write(data);
py.stdin.end();

py.stdout.on('data', function(data){
	dataString = data.toString();
	console.log(dataString)
});