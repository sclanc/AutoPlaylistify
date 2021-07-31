var mysql = require('mysql');

module.exports.DB = class {
    constructor(pass, mysql) {
        this.connection = null;
        this.queries = {
            user: (args) => `INSERT INTO AutoPlaylistify.USER (id, name, email, created, refresh_token, market) VALUES (${this.connection.escape(args.id)}, ${this.connection.escape(args.display_name)}, ${this.connection.escape(args.email)}, NOW(), ${this.connection.escape(args.refresh_token)}, ${this.connection.escape(args.country)}) ON DUPLICATE KEY UPDATE name=${this.connection.escape(args.display_name)}, email=${this.connection.escape(args.email)}, refresh_token=${this.connection.escape(args.refresh_token)};`,
            saveGenerator: (args) => {
                let columns = '', values = '', updates = '';
                const entries = Object.entries(args);
                for (let i = 0; i < entries.length; i ++) {
                    const [key, value] = entries[i];
                    const v = typeof value === 'string' ? `${this.connection.escape(value)}` : value
                    if (i === 0) {
                        columns += key;
                        values += v;
                        updates += `${key}=${v}`;
                    } else {
                        columns += `, ${key}`;
                        values += `, ${v}`;
                        updates += `, ${key}=${v}`;
                    }
                }
                return `INSERT INTO AutoPlaylistify.GENERATOR (${columns}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updates}, created_modified=NOW()`
            },
            getGenerators: (args) => `SELECT * FROM AutoPlaylistify.GENERATOR WHERE user_id = ${this.connection.escape(args.user_id)}`,
			searchGenerators: (args) => `SELECT * FROM AutoPlaylistify.GENERATOR WHERE name LIKE ${this.connection.escape(`%${args.query}%`)} OR seed_artists LIKE ${this.connection.escape(`%${args.query}%`)} OR seed_genres LIKE ${this.connection.escape(`%${args.query}%`)} OR seed_tracks LIKE ${this.connection.escape(`%${args.query}%`)}`,
            deleteGenerators: (args) => `DELETE FROM AutoPlaylistify.GENERATOR WHERE id = '${args.id}';`,
			report: () => `SELECT u.name as name, g.created_modified as time, g.name as generatorName, g.seed_artists, g.seed_genres, g.seed_tracks FROM AutoPlaylistify.GENERATOR g
			INNER JOIN AutoPlaylistify.USER u on u.id = g.user_id`,
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
				const query = this.queries[key](args)
				console.log('Query: ', `key: ${key}`, `args: ${JSON.stringify(args)}`, query);
                 this.connection.query(query, function (error, result, fields) {
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