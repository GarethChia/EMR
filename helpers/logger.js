const winston = require('winston');
const moment = require('moment');

const customLevels = {
	levels: {
		user: 0,
		debug: 1,
		info: 2,
		error: 3
	},
	colors: {
		user: 'blue',
		debug: 'green',
		info: 'yellow',
		error: 'red'
	}
};

// Logger for console
const consoleLogger = new (winston.Logger)({
	levels: customLevels.levels,
	colorize: true,
	transports: [
		new (winston.transports.Console)({
			'timestamp': function(){
				return moment().format("DD-MM-YYYY HH:MM:SS");
			},
			level: 'info',
		}),
		
	]
});

// Log user actions
const userLogger = new (winston.Logger)({
	levels: customLevels.levels,
	colorize: true,
	transports: [
		new (winston.transports.File) ( {
			'timestamp': function(){
				return moment().format("DD-MM-YYYY HH:MM:SS");
			},
			name:'log.user',
			filename: './log/emr_user.log',
			level: 'user',
			eol:'\n'
		})
	]
});

// Log errors actions
const errorLogger = new (winston.Logger)({
	levels: customLevels.levels,
	transports: [
		new (winston.transports.File) ( {
			'timestamp': function(){
				return moment().format("DD-MM-YYYY HH:MM:SS");
			},
			name:'log.error',
			filename: './log/emr_error.log',
			level: 'error',
			eol:'\n'
		})
	]
});

winston.addColors(customLevels.colors);
module.exports = { consoleLogger, userLogger, errorLogger };