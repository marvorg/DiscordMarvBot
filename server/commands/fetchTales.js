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

      $( "#page-content td" ).each(function(i) {
        var title = $(this).children('a').eq(0).text()
        if(re.test(title)){
          console.log('found a match! Title is: '+title+'\nAnd input is: '+input)
          var link = 'http://www.scp-wiki.net'+$(this).children('a').eq(0).attr('href')

          fetchEntry(link, false, title, function(data){
            var embed = new RichEmbed()
            .setTitle(data.title)
            .setDescription(data.description)
            .setColor(5577355)
            .setAuthor('Marv')
            .setURL(data.link)

            callback(embed)
          })
          hasEntry = true
          return false;
        }
      });

      if(!hasEntry){
        callback("We couldn't find what you're looking for! Fetched "+entries+" documents.")
      }
    };
  })
}
