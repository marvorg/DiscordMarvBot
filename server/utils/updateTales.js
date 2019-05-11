const cheerio = require('cheerio');
const request = require('request');
var schedule = require('node-schedule');
Fiber = Npm.require('fibers');

// every midnight run this function
var f = schedule.scheduleJob({hour: 0, minute: 0}, function(){
  // lets fetch every single entry
  request('http://www.scp-wiki.net/tales-by-title', function(error,response,html){
    if (!error && response.statusCode == 200){
      const $ = cheerio.load(html);
      $( "#page-content td" ).each(function(i) {
        var title = $(this).children('a').eq(0).text()
        var link = $(this).children('a').eq(0).attr('href')

        Fiber(function() {
          if(title != "" && title.length >= 0 && title != null){
            var dbObj = tales.findOne({title:title})
            // do we already have a tale matching this title in our DB? and is our link valid?
            if(!dbObj && link != undefined){
              //doesnt exist and link is valid! Lets add it
              tales.insert({title:title, link:'http://www.scp-wiki.net'+link})
            }
          }
        }).run()
      })
    }
  });
})
