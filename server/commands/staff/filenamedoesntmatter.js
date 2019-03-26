module.exports = {
    name: 'info',
    async execute(bot, message, args) {

        //Anything in here is executed with bot, message, and args. Sync or async.

        // {prefix}info will execute this command.

        // Args is an array of each word split at every space for paramaters, just do args.join() and its back to the string. 
        
        // it feels weird to type 'message' my bot uses msg

        // also typing bot, and not client.

        message.channel.send('nou')

    }
}