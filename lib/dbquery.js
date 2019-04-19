const mysql = require('mysql');

class DbQuery {

  /**
   * Instantiate
   * @param {String} config.host
   * @param {String} config.user
   * @param {String} config.pass
   * @param {Number|String} config.port
   * @param {Boolean|String} config.ssl
   * @param {String} config.database (optional)
   * @param {Number|String} config.connectionLimit (optional)
   */
  constructor(config) {
    const dbPoolConfig = {
      connectionLimit: +config.connectionLimit || 10,
      host: config.host,
      user: config.user,
      password: config.pass,
      port: +config.port,
      ssl: (config.ssl.toString().toLowerCase() == 'true') ?
        "Amazon RDS" :
        null
    };
    this.database = config.database;
    this.pool = mysql.createPool(dbPoolConfig);
  }

  /**
   * Run a db query
   * @param {String} query 
   * @param {Array} params 
   */
  runQuery(query, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, params, (error, data) => {
        error ? reject(error) : resolve(data);
      });
    });
  }

}

module.exports = DbQuery;