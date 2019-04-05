timeConverter = function(time){
  var seconds = Math.floor(time / 1000);
  var minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  var hour = Math.floor(minute / 60);
  minute = minute % 60;
  var day = Math.floor(hour / 24);
  hour = hour % 24;
  let uptime = `${Math.round(day)} days, ${Math.round(hour)} hours, ${Math.round(minute)} minutes and ${Math.round(seconds)} seconds`;
  return uptime
}
