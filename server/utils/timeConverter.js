timeConverter = function(time){
  let totalSeconds = (time / 1000);
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let uptime = `${Math.round(days)} days, ${Math.round(hours)} hours, ${Math.round(minutes)} minutes and ${Math.round(seconds)} seconds`;
  return uptime
}
