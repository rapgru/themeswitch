// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let currentTimer;

/*
switches: [
	{
		switchHour: int,
		switchMinute: int,
		theme: String,
	}
]
*/

function getPrevSwitch(switches){
	const now = new Date();
	let differences = switches
		.map((switch_) => ({ date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), switch_.switchHour, switch_.switchMinute, 0, 0), rswitch: switch_ }))
		.map((tswitch) => ({ diff: tswitch.date.getTime() - now.getTime(), date: tswitch.date, rswitch: tswitch.rswitch}));

	let all_positive = differences.every(i => i.diff > 0);

	if(all_positive){
		let result = differences.reduce((p, v) => ( p.diff > v.diff ? p : v ));
		result.date = new Date(result.date.getTime() - 1000*60*60*24);
		result.diff = result.diff - 1000*60*60*24;
		return result;
	} else {
		let result = differences.reduce((previous, current) => {
		  if(current.diff <= 0 && current.diff >= previous.diff) {
			  return current;
		  } else {
			  return previous;
		  }
		}, {diff:-Infinity,date:null});
		return result;
	}
}
function getNextSwitch(switches){
	const now = new Date();
	let differences = switches
		.map((switch_) => ({ date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), switch_.switchHour, switch_.switchMinute, 0, 0), rswitch: switch_ }))
		.map((tswitch) => ({ diff: tswitch.date.getTime() - now.getTime(), date: tswitch.date, rswitch: tswitch.rswitch}));

	let all_negative = differences.every(i => i.diff <= 0);

	console.log()

	if(all_negative){
		let result = differences.reduce((p, v) => ( p.diff < v.diff ? p : v ));
		result.date = new Date(result.date.getTime() + 1000*60*60*24);
		result.diff = result.diff + 1000*60*60*24;
		return result;
	} else {
		let result = differences.reduce((previous, current) => {
		  if(current.diff > 0 && current.diff <= previous.diff) {
			  return current;
		  } else {
			  return previous;
		  }
		}, {diff:Infinity,date:null});
		return result;
	}
}

function applyTheme(tswitch){
	vscode.workspace.getConfiguration('workbench').update('colorTheme', tswitch.rswitch.theme, true);
}

function startTimer(switches) {
	const nextSwitch = getNextSwitch(switches);
	console.log("next switch " + JSON.stringify(nextSwitch));
	let timer = setTimeout(() => {
		console.log("executing switch");
		applyTheme(nextSwitch);
		startTimer(switches);
	}, nextSwitch.diff);
	currentTimer = timer;
}

function createSwitches(config) {
	console.log("config: " + JSON.stringify('config'));
	console.log("configProcessed: " + JSON.stringify(config.map(e => ({ switchHour: e.time.split(':')[0], switchMinute: e.time.split(':')[1], theme: e.theme }))))
	return config.map(e => ({ switchHour: parseInt(e.time.split(':')[0]), switchMinute: parseInt(e.time.split(':')[1]), theme: e.theme }));
}

function getConfig(){
	const conf = vscode.workspace.getConfiguration('themeswitch').get('directives');
	console.log(conf);
	return (conf ? conf : []); 
}

function checkConfigAndStart(){
	const conf = getConfig();
	if(conf !== [] && conf.length !== 0){
		applyTheme(getPrevSwitch(createSwitches(conf)))
		startTimer(createSwitches(conf));
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "themeswitch" is now active!');

	vscode.workspace.onDidChangeConfiguration((e) => {
		if(e.affectsConfiguration('themeswitch')){
			console.log('Config changed');
			clearTimeout(currentTimer);
			checkConfigAndStart();
		}
	})
	checkConfigAndStart();
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	clearTimeout(currentTimer);
}
module.exports = {
	activate,
	deactivate
}
