Meteor.startup(function () {
  //reset our ratelimits
  ratelimit.find().forEach(function(result){
    ratelimit.update({_id: result._id}, {$set:{calls: 0}})
  })

  //reset our queue
  utils.update({_id:"stats"}, {$set:{size:0}})
});
