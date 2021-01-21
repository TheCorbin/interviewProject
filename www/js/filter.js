angular.module('starter').filter('dateConvert', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; }
  var _date = $filter('date')(new Date(input), 'MMM dd yyyy');
  return _date;
 };
});
