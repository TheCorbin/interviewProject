angular.module('starter').filter('dateConvert', function($filter)
{
  return function(input)
  {
    if (input.length < 11){
      var original_date = $filter('date')(input, 'MMM dd yyyy');
      return original_date;
    }

  if(input == null){ return ""; }
  var _date = $filter('date')(new Date(input), 'MMM dd yyyy');
  return _date;
 };
});
