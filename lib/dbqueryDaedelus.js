const DbQuery = require("./dbquery");

module.exports = class DbQueryDaedalus extends DbQuery {
  /**
   * Instantiate
   */
  constructor() {
    super({
      host: "hackdaedalus.cick4ue9wa5u.us-east-1.rds.amazonaws.com/",
      user: "Hackdaedalus",
      pass: "Hackdaedalus",
      port: 3306,
      ssl: true,
      database: "Hackdaedalus"
    });
  }

  /**
   * Queries replay db for session info
   * @param {String} gsid
   * @param {String} sid
   * @param {Array} widthTargets
   * @param {Number} widthThreshold
   */
  selectSessionInfo(gsid, sid, widthTargets, widthThreshold) {
    const whereClause = Array(widthTargets.length)
      .fill("(page_width BETWEEN ? AND ?)")
      .join(" OR ");
    let params = [gsid, sid];

    widthTargets.forEach(wt => {
      params.push(wt - widthThreshold);
      params.push(wt + widthThreshold);
    });

    const sessionQuery = `SELECT global_session_id, session_id, url, page_number, page_width, time_index
      FROM ${this.database}.session_paths_v3
      WHERE global_session_id = ? AND  session_id = ? AND (${whereClause})`;
    return this.runQuery(sessionQuery, params);
  }
};

// module.exports = DbQueryDaedalus;
