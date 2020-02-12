const { RichEmbed } = require('discord.js');
const proposals = require('../localisation/proposals.json');
const links = require('../localisation/baseLinks.json');

fetchProposals = function(lang){
  var links = `[${proposals[lang].JON}](${links[lang].LINK}jonathan-ball-s-proposal) \n \
  [${proposals[lang].GEARS}](${links[lang].LINK}dr-gears-s-proposal) \n \
  [${proposals[lang].CLEF}](${links[lang].LINK}dr-clef-s-proposal) \n \
  [${proposals[lang].QNTM}](${links[lang].LINK}qntm-s-proposal) \n \
  [${proposals[lang].O5}](${links[lang].LINK}scp-001-o5) \n \
  [${proposals[lang].MANN}](${links[lang].LINK}dr-manns-proposal) \n \
  [${proposals[lang].MACK}](${links[lang].LINK}mackenzie-s-proposal) \n \
  [${proposals[lang].SAND}](${links[lang].LINK}sandrewswann-s-proposal) \n \
  [${proposals[lang].SCAN}](${links[lang].LINK}scantron-s-proposal) \n \
  [${proposals[lang].DJORIC}](${links[lang].LINK}djoric-dmatix-proposal) \n \
  [${proposals[lang].ROGET}](${links[lang].LINK}roget-s-proposal) \n \
  [${proposals[lang].OUROBOROS}](${links[lang].LINK}ouroboros) \n \
  [${proposals[lang].KATE}](${links[lang].LINK}kate-mctiriss-s-proposal) \n \
  [${proposals[lang].KAL}](${links[lang].LINK}kalinins-proposal) \n \
  [${proposals[lang].WRONG}](${links[lang].LINK}wrong-proposal) \n \
  [${proposals[lang].SHAGGY}](${links[lang].LINK}shaggydredlocks-proposal) \n \
  [${proposals[lang].SPIKE}](${links[lang].LINK}spikebrennan-s-proposal) \n \
  [${proposals[lang].WJS}](${links[lang].LINK}wjs-proposal) \n \
  [${proposals[lang].BILL}](${links[lang].LINK}billiths-proposal) \n \
  [${proposals[lang].TANHONY}](${links[lang].LINK}tanhony-s-proposal) \n \
  [${proposals[lang].LILY}](${links[lang].LINK}lily-s-proposal) \n \
  [${proposals[lang].TUFTOS}](${links[lang].LINK}tuftos-proposal) \n \
  [${proposals[lang].JIM}](${links[lang].LINK}jim-north-s-proposal) \n \
  [${proposals[lang].IHP}](${links[lang].LINK}i-h-p-proposal) \n \
  [${proposals[lang].EX}](${links[lang].LINK}scp-001-ex) \n \
  [${proposals[lang].WMDD}](${links[lang].LINK}wmdd-s-proposal) \n \
  [${proposals[lang].KIRBY}](${links[lang].LINK}captain-kirby-s-proposal) \n \
  [${proposals[lang].PEDANTIQUE}](${links[lang].LINK}pedantique-s-proposal)`

  var embed = new RichEmbed()
  .setTitle('001 proposals')
  .setDescription(links)
  .setColor(5577355)
  .setAuthor('Marv')
  return embed
}
