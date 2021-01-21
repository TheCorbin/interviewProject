angular.module('app.services', ['app.config'])
.factory('DB', function($q, DB_CONFIG) {
    var self = this;
    self.db = null;
    self.init = function() {
        if (window && window.sqlitePlugin) { self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); }
        else { self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1); }
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];
            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });
            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
        });
    };
    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();
        if (!self.db) { self.init(); }
        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    self.fetchAll = function(result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    };
    self.fetch = function(result) {
        return result.rows.item(0);
    };
    return self;
})
// Methods to interact with a table
.factory('Table', function(DB) {
    var self = this;
    self.getAll = function(tableName) {
        var query = 'SELECT * FROM ' + tableName;
        return DB.query(query).then(function(result){ return DB.fetchAll(result); });
    };
    self.getAllOrderedByColumn = function(tableName, columnName, descending) {
        var query = 'SELECT * FROM ' + tableName + ' ORDER BY ' + columnName
        if (descending) { query = query + ' DESC' }
        return DB.query(query).then(function(result){ return DB.fetchAll(result); });
    };
    self.getById = function(tableName, idColumnName, id) {
        var sql = "SELECT * FROM " + tableName + " WHERE " + idColumnName + " = ?";
        return DB.query(sql, [id])
        .then(function(result){
            if (result.rows.length > 0) {
                return DB.fetchAll(result);
            }
            else {
                return null;
            }
        });
    };
    self.getByQuery = function(query) {
        return DB.query(query)
        .then(function(result){
            if (result.rows.length > 0) {
                return DB.fetchAll(result);
            }
            else {
                return null;
            }
        });
    };

    self.create = function(obj) {
        var sql = obj.getInsertStatement();
        var params = obj.getInsertParams();
        return DB.query(sql, params)
        .then(function(result) {
          return result;
        });
    }
    self.deleteById = function(tableName, idColumnName, id) {
        var sql = "DELETE FROM " + tableName + " WHERE " + idColumnName + " = ?";
        return DB.query(sql, [id])
        .then(function(result){ return result; });
    }
    self.update = function(obj) {
        var sql = obj.getUpdateStatement();
        var params = obj.getUpdateParams();
        return DB.query(sql, params)
        .then(function(result) { return result; });
    }
    self.delete = function(obj)
    {
        var sql = obj.getDeleteStatement();
        return DB.query(sql)
        .then(function(result){ });
    }
    self.executeSqlStatement = function(sql) {
        return DB.query(sql)
        .then(function(result){ return result; });
    }
    return self;
});
