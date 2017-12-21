exports.PORT = process.env.PORT || global.PORT || 3000;

exports.MYSQL_HOST = process.env.MYSQL_HOST || global.MYSQL_HOST || 'localhost';
exports.MYSQL_USER = process.env.MYSQL_USER || global.MYSQL_USER || 'root';
exports.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || global.MYSQL_PASSWORD || 'N2tPr1nT';
exports.MYSQL_DATABASE = process.env.MYSQL_DATABASE || global.MYSQL_DATABASE || 'geekdom';
exports.MYSQL_PORT = 3306;

exports.UPS_USERNAME = process.env.UPS_USERNAME;
exports.UPS_PASSWORD = process.env.UPS_PASSWORD;
exports.UPS_ACCESS_KEY = process.env.UPS_ACCESS_KEY;
