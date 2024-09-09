const { option, stringify, callback, menu } = require("../messageFunctions/botfunction");
const { editMessage } = require("../messageFunctions/sender");


const errorHandler = async (bot, chatId, messageId, errorMessage, options, isAdmin=false) => {
    let buttons;
    if (!options||!options.back) {
        buttons = stringify([[option('🔙 Back', 'mainMenu')]]);
    } else if (isAdmin) {
        buttons = options.admin?stringify([
            [callback('🔙 Back', `${options.admin}`, `${options.back}`)],
            [menu(chatId)]
        ]):stringify([[menu(chatId)]]);
    } else {
        buttons = stringify([
            [option('Contact Admin', JSON.stringify({ type: 'contact', value: `${options.contact}` }))],
            [option('🔙 Back', options.back)]
        ])
    }
    
    try {
        await editMessage(bot, `${errorMessage}`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: buttons.reply_markup 
        });
    } catch (error) {
        console.error('Error handling the error:', error);
    }
};

module.exports = errorHandler