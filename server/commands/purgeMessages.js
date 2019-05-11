purge = function(amount, type, user, message, callback){

  if (!type && !user){
    callback('base')

  } else if (!type && user){
    message.channel.fetchMessages({limit:amount, before:message.id}).then(messages => {
      const userMessages = messages.filter(m => m.author.id === user)
      callback(userMessages)
    })

  } else if (type && !user){
    message.channel.fetchMessages({limit:amount, before:message.id}).then(messages => {
      let typeMessages
      if (type == 'image' || type == 'img'){
        typeMessages = messages.filter(m => m.attachments.size > 0)

      } else if (type == 'bot'){
        typeMessages = messages.filter(m => m.author.bot)
      }

      callback(typeMessages)
    })

  } else if (type && user){
    message.channel.fetchMessages({limit:amount, before:message.id}).then(messages => {
      let specMessages

      if (type == 'image' || type == 'img'){
        specMessages = messages.filter(function(m){
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
