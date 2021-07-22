var mysql = require('mysql');

module.exports.DB = class {
    constructor(pass, mysql) {
        this.connection = null;
        this.queries = {
            test: 'SELECT 1 + 1 AS solution',
            user: (args) => `INSERT INTO AutoPlaylistify.USER (id, name, email, created, refresh_token, market) VALUES (${args.id}, '${args.display_name}', '${args.email}', NOW(), '${args.refresh_token}', '${args.country}') ON DUPLICATE KEY UPDATE name='${args.display_name}', email='${args.email}', refresh_token='${args.refresh_token}';`,
            saveGenerator: (args) => {
                let columns = '', values = '', updates = '';
                const entries = Object.entries(args);
                for (let i = 0; i < entries.length; i ++) {
                    const [key, value] = entries[i];
                    const v = typeof value === 'string' ? `'${value}'` : value
                    if (i === 0) {
                        columns += key;
                        values += v;
                        updates += key === 'id' ? '' : `${key}=${v} `;
                    } else {
                        columns += `, ${key}`;
                        values += `, ${v}`;
                        updates += key === 'id' ? '' : `, ${key}=${v}`;
                    }
                }
                return `INSERT INTO AutoPlaylistify.GENERATOR (${columns}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updates}`
            },
            getGenerators: (args) => `SELECT * FROM AutoPlaylistify.GENERATOR WHERE user_id = ${args.user_id}`,
            deleteGenerators: (args) => `DELETE FROM AutoPlaylistify.GENERATOR WHERE id = ${args.id};`,
        }
    }

    connect(pass) {
        this.connection = mysql.createConnection({
            host     : 'autoplaylistify.cgodhpy2rkrv.us-west-2.rds.amazonaws.com',
            user     : 'admin',
            password : pass,
            port     : 3306
          });
        this.connection.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          
            console.log('Connected to database.');
          });
        

    }

    query(key, args, callback) {
        if (this.queries[key]) {
            try {
                 this.connection.query(this.queries[key](args), function (error, result, fields) {
                    if (error) throw error;
                    callback(result);
                  });
            } catch(e) {
                callback({error: 'request failed'})
                console.error('ERROR:', e);
            }

        }

    }

    end() {
        this.connection.end();
        console.log('DB connection ended');
    }
}