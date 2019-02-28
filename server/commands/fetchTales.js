const { RichEmbed } = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');

fetchTales = function(input, callback){
  var dbObj = {}
  var isAgr = false
  if(input != 'random'){
    dbObj = tales.findOne({title: {$regex: new RegExp(".*" + input + ".*", "gmi")}})
  }else{
    isAgr = true
    dbObj = tales.aggregate({$sample:{size: 1}})
  }

  if(dbObj){
    if(isAgr){
      sendUpstream(dbObj[0].link, dbObj[0].title)
    }else{
      sendUpstream(dbObj.link, dbObj.title)
    }
  }else{
    sendUpstream(false, false, true)
  }

  function sendUpstream(link, title, error){
    if(!error){
      fetchEntry(link, false, title, function(data){
        var embed = new RichEmbed()
        .setTitle(data.title)
        .setDescription(data.description)
        .setColor(5577355)
        .setAuthor('Marv')
        .setURL(data.link)

        if(data.image){
          embed.setThumbnail(data.image)
        }

        callback(embed)
      })
    }else{
      callback('We couldn\'t fetch a random tale! Please try again.')
    }
  }
}
