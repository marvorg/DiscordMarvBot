const { RichEmbed } = require('discord.js');
var Queue = require('better-queue');
const request = require('request');
Fiber = Npm.require('fibers');

q = new Queue(function (what, cb) {
  var startTime = new Date()
  request(`http://${process.env.GEN_SERV}:5000/?scp=`+what+'&auth='+process.env.GEN_AUTH, function(error,response,html){
    if (!error && response.statusCode == 200){
      var embed = new RichEmbed()
      .setTitle('Marv Containment Unit:tm:')
      .setDescription(html)
      .setColor(5577355)
      .setFooter("generated in " + (new Date() - startTime)+'ms')

      Fiber(function() {
        utils.update({_id:"stats"}, {$push:{gen_time:new Date() - startTime}})
      }).run();

      cb(embed)
    }else{
      cb('Server is offline!')
    }

    Fiber(function() {
      utils.update({_id:"stats"}, {$inc:{size:-1}})
    }).run();

  });
}, { maxTimeout: 30000, concurrent: 1 })

generateShort = function(what, callback){
  if(what.split(' ').length > 1){
    callback(false)
  }else{
    utils.update({_id:"stats"}, {$inc:{size:1}})
    q.push(parseInt(what), function(data){
      callback(data)
    })
  }
}


shortPreProcessing = function(message){
  var server = message.guild.id
  var calls = 0
  if(!ratelimit.findOne({_id: server})){
    ratelimit.insert({_id:server, calls:0})
  }else{
    calls = ratelimit.findOne({_id:server}).calls
  }
  if(calls < 5){
    ratelimit.update({_id:server}, {$inc:{calls:1}})
    var size = 0
    var gen_time = []
    var total = 0

    if(!utils.findOne({_id:"stats"})){
      utils.insert({_id:"stats", size:0, gen_time:[]})
    }else{
      size = utils.findOne({_id:"stats"}).size
      gen_time = utils.findOne({_id:"stats"}).gen_time
    }

    for(var i = 0; i < gen_time.length; i++) {
      total += gen_time[i];
    }

    var average = Math.round(total / gen_time.length * 100) / 100

    var embed = new RichEmbed()
    .setTitle('Marv Containment Unit:tm:')
    .setColor(5577355)
    .addField("Position in Queue", size+1)
    .addField("Estimated Wait:", timeConverter(average * (size+1))+'\n\nI\'ll ping you when your story is ready!')
    return ['ok', embed, message.author.id]
  }else{
    logRatelimit(message)
    return ['fail', "You have reached your servers limit for generating stories! To ensure each server has a chance to generate a story, we've setup a rate-limit that resets every 30 minutes. The current rate-limit is 5."]
  }
}
