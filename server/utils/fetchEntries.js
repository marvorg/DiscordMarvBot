const cheerio = require('cheerio');
const request = require('request');

fetchEntry = function(link, num, title, callback){
  var text = ''
  var image = ''
  var title = title
  request(link, function(error,response,html){
    if (!error && response.statusCode == 200){
      const $ = cheerio.load(html);
      $( "#page-content p" ).each(function(i) {
        if (num && num == '001' && i == 2){
          return false
        }
        if (i == 5) {
          return false;
        }
        text = text+$(this).text()+'\n\n'
      });

      if($("#page-content > .scp-image-block .image").attr('src')){
        image = $("#page-content > .scp-image-block .image").attr('src')
      }

      // are we longer than 2000 chars?
      if (text.length >= 2000) {
        // yup. Lets truncate to 1997 and add some fancy elipsis!
        text = text.substr(0, 1997)+'...'
      }

      if(!title){
        title = 'Link -> SCP-' + num
      }
      var embed = {
        "title": title,
        "description": text,
        "url": link,
        "image": image
      };
      callback(embed)
    }else{
      callback('fail')
    }
  });
}
