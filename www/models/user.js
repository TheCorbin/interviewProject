function User (o) {
  this.tableName = "User";
  this.keyFieldName = "id";

  this.id = 0;
  this.firstName = "";
  this.lastName = "";
  this.sex = "";
  this.birthdate = "";

  this.parseObject = function(o) {
      if (!!o.id) { this.id = o.id; }
      if (!!o.firstName) { this.firstName = o.firstName; }
      if (!!o.lastName) { this.lastName = o.lastName; }
      if (!!o.sex) { this.sex = o.sex; }
      if (!!o.birthdate) { this.birthdate = o.birthdate; }
  }
   this.getInsertStatement = function() {
      return "INSERT INTO " + this.tableName +
      "(firstName, lastName, sex, birthdate)" +
      " Values (? , ? , ? , ?)" ;
  }
this.getInsertParams = function() {
    console.log('the birthdate', this.birthdate)
      return [
      this.firstName,
      this.lastName,
      this.sex,
      this.birthdate
  ];
  }
  this.getUpdateStatement = function() {
      return "UPDATE " + this.tableName +
      " SET firstName = ? " +
      ", lastName = ? " +
      ", sex = ? " +
      ", birthdate = ? " +
      " WHERE " + this.keyFieldName + " = ? ";
  }
  this.getUpdateParams = function () {
      return [
          this.firstName,
          this.lastName,
          this.sex,
          this.birthdate,
          this.id
  ];
  }
  this.getDeleteStatement = function() {
      return "DELETE FROM " + this.tableName + " WHERE " + this.keyFieldName + " = '" + this.id + "' ";
  }

  if (!!o) {
      this.parseObject(o);
  }
}
