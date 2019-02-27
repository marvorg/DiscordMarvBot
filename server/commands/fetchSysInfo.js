const { RichEmbed } = require('discord.js');
const si = require('systeminformation');

fetchSysInfo = function(callback){
  function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
  si.mem(function(data) {
    var total_mem = formatBytes(data.total)
    var avail_mem = formatBytes(data.available)
    si.currentLoad(function(data){
      var cur_load = data.currentload
      var avg_load = data.avgload

      var embed = new RichEmbed()
      .setTitle('Diag-Marv-stics')
      .setDescription('Current server load information')
      .setColor(5577355)
      .addField("Available Memory", avail_mem)
      .addField("Total Memory", total_mem)
      .addField("Average Load", avg_load)
      .addField("Current Load", cur_load)

      callback(embed)
    })
  })
}
