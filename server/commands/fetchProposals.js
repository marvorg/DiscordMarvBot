const { RichEmbed } = require('discord.js');

fetchProposals = function(){
  var links = "[Sheaf Of Papers](http://www.scp-wiki.net/jonathan-ball-s-proposal) \n \
  [The Prototype](http://www.scp-wiki.net/dr-gears-s-proposal) \n \
  [The Gate Guardian](http://www.scp-wiki.net/dr-clef-s-proposal) \n \
  [The Lock](http://www.scp-wiki.net/qntm-s-proposal) \n \
  [The Factory](http://www.scp-wiki.net/scp-001-o5) \n \
  [The Spiral Path](http://www.scp-wiki.net/dr-manns-proposal) \n \
  [The Legacy](http://www.scp-wiki.net/mackenzie-s-proposal) \n \
  [The Database](http://www.scp-wiki.net/sandrewswann-s-proposal) \n \
  [The Foundation](http://www.scp-wiki.net/scantron-s-proposal) \n \
  [Thirty-Six](http://www.scp-wiki.net/djoric-dmatix-proposal) \n \
  [Keter Duty](http://www.scp-wiki.net/roget-s-proposal) \n \
  [Ouroboros](http://www.scp-wiki.net/ouroboros) \n \
  [A Record](http://www.scp-wiki.net/kate-mctiriss-s-proposal) \n \
  [Past and Future](http://www.scp-wiki.net/kalinins-proposal) \n \
  [The Consensus](http://www.scp-wiki.net/wrong-proposal) \n \
  [When Day Breaks](http://www.scp-wiki.net/shaggydredlocks-proposal) \n \
  [Gods Blind Spot](http://www.scp-wiki.net/spikebrennan-s-proposal) \n \
  [Normalcy](http://www.scp-wiki.net/wjs-proposal) \n \
  [The World at Large](http://www.scp-wiki.net/billiths-proposal) \n \
  [Dead men](http://www.scp-wiki.net/tanhony-s-proposal) \n \
  [The Worlds gone Beautiful](http://www.scp-wiki.net/lily-s-proposal) \n \
  [The Scarlet King](http://www.scp-wiki.net/tuftos-proposal) \n \
  [A Simple Toymaker](http://www.scp-wiki.net/jim-north-s-proposal) \n \
  [Story of Your Life](http://www.scp-wiki.net/i-h-p-proposal) \n \
  [A Good Boy](http://www.scp-wiki.net/scp-001-ex) \n \
  [Project Palisade](http://www.scp-wiki.net/wmdd-s-proposal) \n \
  [O5-13](http://www.scp-wiki.net/captain-kirby-s-proposal) \n \
  [Fishhook](http://www.scp-wiki.net/pedantique-s-proposal)"

  var embed = new RichEmbed()
  .setTitle('001 proposals')
  .setDescription(links)
  .setColor(5577355)
  .setAuthor('Marv')
  return embed
}
