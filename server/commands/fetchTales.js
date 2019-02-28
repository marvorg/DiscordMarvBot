const { RichEmbed } = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');

fetchTales = function(input, callback){
  request('http://www.scp-wiki.net/tales-by-title', function(error,response,html){
    if (!error && response.statusCode == 200){
      const $ = cheerio.load(html);
      var re = new RegExp(".*" + input + ".*", "gmi")
      var hasEntry = false
      var entries = 0

      $( "#page-content td" ).each(function(i) {
        entries++
      });

      if(input != 'random'){
        $( "#page-content td" ).each(function(i) {
          var title = $(this).children('a').eq(0).text()
          if(re.test(title)){
            var link = 'http://www.scp-wiki.net'+$(this).children('a').eq(0).attr('href')

            sendUpstream(link, title, false)
            hasEntry = true
            return false;
          }
        });
        if(!hasEntry){
          callback("We couldn't find what you're looking for! Fetched "+entries+" documents.")
        }
      }else{
        var attempt = 0
        function fetchRandomTale(){
          var randNum = Math.floor(Math.random()*(entries-1+1)+1)
          $( "#page-content td" ).each(function(i) {
            var entry = $(this).children('a').eq(0)
            if(i == randNum){
              var title = entry.text()
              var link = 'http://www.scp-wiki.net'+entry.attr('href')
              if(title && link){
                sendUpstream(link, title, false)
              }else{
                // invalid entry
                if(attempt < 5){
                  attempt++
                  fetchRandomTale()
                }else{
                  sendUpstream(false, false, true)
                }
              }
              return false;
            }
          });
        }
        fetchRandomTale()
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

            callback(embed)
          })
        }else{
          callback('We couldn\'t fetch a random tale! Please try again.')
        }
      }
    };
  })
}
