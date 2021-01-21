
angular.module('app.config', [])
    .constant('DB_CONFIG', {
        name: 'DB',
        tables: [
            {
                name: 'user',
                columns: [
                    { name: 'id', type: 'integer primary key autoincrement' },
                    { name: 'firstName', type: 'text' },
                    { name: 'lastName', type: 'text' },
                    { name: 'sex', type: 'text' },
                    { name: 'birthdate', type: 'text' }
                ]
            }
        ]
    });
