const { RichEmbed } = require('discord.js');

fetchSCP = function(num, callback){
  var attempt = 0
  var isRandom = false
  fetch(num)

  // Recursive function to have a health check for random, and lower the chance it fails to find an SCP entry
  function fetch(num){
    if (num == 'random'){
      isRandom = true
      num = String(Math.floor(Math.random()*(4999-001+1)+001)).padStart(3,'0')
    }
    var link = 'http://www.scp-wiki.net/scp-' + num
    var scpnum = 'Link -> SCP-' + num

    fetchEntry(link, num, '', function(data){
      var embed = ''
      if(data != 'fail'){
        embed = new RichEmbed()
        .setTitle(data.title)
        .setDescription(data.description)
        .setColor(5577355)
        .setAuthor('Marv')
        .setURL(data.url)

        if(data.image){
          embed.setThumbnail(data.image)
        }

      }else{

        if(attempt <= 5 && isRandom){
          fetch('random')
          attempt++
          return false

        }else{
          embed = "That SCP doesnt exist, use `help` for more info on the command"
        }
      }

      callback(embed)
    })
  }

}
