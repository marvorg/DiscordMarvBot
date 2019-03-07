var schedule = require('node-schedule');
Fiber = Npm.require('fibers');

var u = schedule.scheduleJob('*/30 * * * *', function(){
  // runs every 30 minutes
  Fiber(function() {
    //for every ratelimit item
    ratelimit.find().forEach(function(result){
      //reset the calls
      ratelimit.update({_id: result._id}, {$set:{calls: 0}})
    })
  }).run()
});
