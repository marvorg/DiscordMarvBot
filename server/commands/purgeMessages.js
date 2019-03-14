purge = function(amount, type, user, message, callback){

  if (!type && !user){
    callback('base')

  } else if (!type && user){
    console.log('user')
    message.channel.fetchMessages({limit:amount}).then(messages => {
      const userMessages = messages.filter(m => m.author.id === user)
      callback(userMessages)
    })

  } else if (type && !user){
    console.log('type')
    message.channel.fetchMessages({limit:amount}).then(messages => {
      let typeMessages
      if (type == 'image' || type == 'img'){
        typeMessages = messages.filter(m => m.attachments.size > 0)
      } else if (type == 'bot'){
        typeMessages = messages.filter(m => m.author.bot)
      }
      callback(typeMessages)
    })

  } else if (type && user){
    console.log('both')
    message.channel.fetchMessages({limit:amount}).then(messages => {
      let specMessages

      if (type == 'image' || type == 'img'){
        specMessages = messages.filter(function(m){
          console.log(m.author.id+' '+user)
          if(m.attachments.size > 0 && m.author.id === user) return true;
        })

      } else if (type == 'bot'){
        specMessages = messages.filter(function(m){
          if(m.author.bot && m.author.id === user) return true;
        })
      }

      callback(specMessages)
    })
  }
}
