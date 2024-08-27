const TelegramBot = require('node-telegram-bot-api');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const { forms, extractNairaAmount, extractDataAmount, findServicePlanText, _message, userfinder, key } = require('./botfunction');
const User = require('./models/userModel');

const service = ['data', 'airtime']
let msgId = null;
let phone = null;
let isPhone;
let isAirtime;
let textValue;
let value;
let network;
let host;
let amount;
let ref;
let aut;
let cpass;
let ncpass;
let oldPasscode;
let referenceId;
let a;
let b;
let c;

const balance = 0;

mongoose.connect(process.env.MONGO_URI).then(() => {
    const bot = new TelegramBot(process.env.TOKEN, { polling: true });
    console.log("Bot is running...");
    bot.on('new_chat_members', (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, _message)
    })
    // Start command
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        if (!userfinder(key[1], id)) {
            a = true;
            bot.sendMessage(chatId, 'To continue enter a passcode of at least 4 characters.')
        } else {
            return;
        }

    });
    
    // Main menu function
    function sendStartMessage(chatId, register) {
        const options = {
            reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Make Purchase', callback_data: 'option1' }],
                [{ text: 'Manage Account', callback_data: 'option2' }],
            ]
            })
        };
        bot.sendMessage(chatId, `Hello Dear. We are happy to have you on our Vendor Bot. Here is your Account Unique Token _${register.AUT}_. You will need this in case you want to access your VB account on another telegram account, so keep it safe dear, this token contains all your  account info and transactions. Select an option below to proceed:`, options).then((msg) => {
            msgId = msg.message_id;
        });
    }
    
    function sendMainMenu(chatId) {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'Make Purchase', callback_data: 'option1' }],
            [{ text: 'Manage Account', callback_data: 'option2' }],
          ]
        })
      };
      bot.sendMessage(chatId, 'Choose an option:', options);
    }
    
    // Submenu function for data forms
    function sendDataFormsMenu(chatId, messageId) {
      const dataForms = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'MTN SME', callback_data: 'mtn' }],
            [{ text: 'Airtel CG', callback_data: 'airtel' }],
            [{ text: 'Second Form', callback_data: '_Second_Form' }],
            [{ text: 'Third Form', callback_data: '_Third_Form' }],
            [{ text: '🔙 Back', callback_data: 'mainMenu' }],
          ]
        })
      };
      bot.editMessageText('Choose a data form:', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: dataForms.reply_markup,
      });
    }
    
    bot.on('callback_query', (query) => {
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        const data = query.data;
    
        let parsedData;
    
        // Attempt to parse JSON if it looks like JSON
        if (typeof data === 'string' && data.startsWith('{') && data.endsWith('}')) {
            try {
                parsedData = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return; // Exit if parsing fails
            }
        }
    
        switch (data) {
            case 'option1':
                bot.editMessageText('Select a purchase option:', {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Buy Data', callback_data: 'dataOpt' }],
                            [{ text: 'Buy Airtime', callback_data: 'airtimeOpt' }],
                            [{ text: 'Make Deposit', callback_data: 'depositOpt' }],
                            [{ text: '🔙 Back', callback_data: 'mainMenu' }],
                        ]
                    })
                });
                break;
            case 'dataOpt':
                sendDataFormsMenu(chatId, messageId);
                break;
            case 'option2':
                bot.editMessageText('Manage your account:', {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Transaction History', callback_data: 'history' }],
                            [{ text: 'Login existing account', callback_data: 'login' }],
                            [{ text: 'Change Passcode', callback_data: 'changepass' }],
                            //[{ text: 'Resolve pending transaction', callback_data: 'pendings' }],
                            [{ text: 'Contact Us', callback_data: 'contact' }],
                            [{ text: '🔙 Back', callback_data: 'mainMenu' }],
                        ]
                    })
                });
                break;
            case 'mainMenu':
                sendMainMenu(chatId);
                break;
            case 'airtimeOpt':
                isAirtime = true;
                phone = null;
                isPhone = true;
                bot.editMessageText("Enter Receiver's Phone Number", {
                    chat_id: chatId,
                    message_id: messageId,
                });
                break;
            case 'buydata':
                bot.editMessageText('Transaction Processing...', {
                    chat_id: chatId,
                    message_id: messageId,
                }).then(() => {
                    const info = { network, value, host, phone, purchase: 'Data purchase' }
                    const id = { TId: chatId, service: service[0], info };
                    const buy = userfinder(key[8], id)
                    bot.editMessageText(buy, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: 'Verify Transaction', callback_data: 'verify' }],
                                [{ text: 'Contact Admin', callback_data: 'contact' }],
                                [{ text: '🔙 Back', callback_data: 'mainMenu' }],
                            ]
                        })
                    })
                })
                .catch((error) => {
                    console.error('Error editing message:', error);
                });
                break;
            case 'buyAirtime':
                bot.editMessageText('Transaction Processing...', {
                    chat_id: chatId,
                    message_id: messageId,
                }).then(() => {
                    const info = { network, amount, phone, purchase: 'Airtime purchase' };
                    const id = { TId: chatId, service: service[0], info };
                    const buy = userfinder(key[8], id)
                    bot.editMessageText(buy, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: 'Verify Transaction', callback_data: 'verify' }],
                                [{ text: 'Contact Admin', callback_data: 'contact' }],
                                [{ text: '🔙 Back', callback_data: 'mainMenu' }],
                            ]
                        })
                    })
                })
                .catch((error) => {
                    console.error('Error editing message:', error);
                });
                break;

            case 'history':
                let id = { TId: chatId };
                let history = userfinder(key[6], id);
                let options = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: history.map(tranx => [{ text: `${tranx.updatedAt} ${tranx.description}`, callback_data: tranx.referenceId }])
                    }).then((editedMessage) => {
                        msgId = editedMessage.message_id;
                        // console.log('Last message ID:', msgId);
                    })
                };
                ref = true;
                bot.editMessageText("Here are your recent transactions", {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: options.reply_markup,
                });
                break;    
            case 'login':
                aut = true;
                bot.editMessageText("Enter you Account Unique Token to login", {
                    chat_id: chatId,
                    message_id: messageId
                });
                break;
                   
            case 'changepass':
                cpass = true;
                bot.editMessageText("Enter old passcode", {
                    chat_id: chatId,
                    message_id: messageId
                });
                break;
            case 'contact':
                b = true;
                bot.editMessageText("Report Account issue", {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: `Account issue`, callback_data: 'bug' }],
                            [{ text: 'Report bug', callback_data: 'bug' }],
                            [{ text: 'Cancel Request', callback_data: 'mainMenu'}],
                        ]
                    })
                });
                break;            
            case 'bug':
                b = true;
                bot.sendMessage(chatId, "Write in detail the fault you encountered");
                break;
            
            case 'handleBug':
                id = { psd: '', TId: c };
                history = userfinder(key[6], id);
                options = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: `Make Transaction`, callback_data: /* @param todo; */'' }],
                            [{ text: 'Suspend account', callback_data: 'bug' }],
                            [{ text: 'Account Info', callback_data: 'mainMenu'}],
                        ]
                    }).then((editedMessage) => {
                        msgId = editedMessage.message_id;
                        // console.log('Last message ID:', msgId);
                    })
                };
                bot.sendMessage("Report Account issue", {
                    chat_id: process.env.TID,
                    message_id: messageId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: `View account`, callback_data: 'bug' }],
                            [{ text: 'Suspend account', callback_data: 'bug' }],
                            [{ text: 'Handle request', callback_data: 'mainMenu'}],
                        ]
                    })
                });
                break;
                    
            default:
                if (parsedData && parsedData.type === 'airtimeOpt') {
                    isAirtime = false;
                    value = parsedData.value;
                    textValue = findServicePlanText(value);
                    phone = null;
                    isPhone = true;
                    bot.editMessageText("Enter Receiver's Phone Number", {
                        chat_id: chatId,
                        message_id: messageId,
                    }).then((editedMessage) => {
                        msgId = editedMessage.message_id;
                        // console.log('Last message ID:', msgId);
                    })
                    .catch((error) => {
                        console.error('Error editing message:', error);
                    });
                } else if (!isNaN(data) && data <= 500) { // Check if the data is a number and less than or equal to 500
                        const amount = data;
                        if (isPhone && phone) {
                            const options = {
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [
                                        [{ text: `Pay ₦${amount}`, callback_data: 'buyAirtime' }],
                                        [{ text: '🔙 Back', callback_data: 'airtimeOpt' }],
                                        [{ text: 'Cancel Request', callback_data: 'option1'}],
                                    ]
                                })
                            }    
                        
                            bot.editMessageText(`Confirm your request for ₦${amount} to ${phone}:`, {
                                    chat_id: chatId,
                                    message_id: messageId,
                                    reply_markup: options.reply_markup,
                            });
                        };
                } else if (forms[data]) {
                    network = data
                    const servicePlans = forms[data]._Service_Plan.map(plan => ({
                        text: plan.InnerText,
                        callback_data: JSON.stringify({
                            type: "airtimeOpt",
                            value: plan.Value,
                        })
                    }));
                    
                    servicePlans.push({ text: '🔙 Back', callback_data: 'option1' });
                
                    const options = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: servicePlans.map(plan => [{ text: plan.text, callback_data: plan.callback_data }])
                        })
                    };
                
                    bot.editMessageText('Choose a service plan:', {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: options.reply_markup,
                    });
                } else {
                    console.warn('Unhandled callback data:', data);
                    break;
                }
        }
    });
    
    bot.onText(/^0[789]\d{9}$/, (msg) => { // Matches
        const chatId = msg.chat.id;
        phone = msg.text;
        if (isPhone && isAirtime) {
            const options = { reply_markup: { inline_keyboard: [ [{ text: '₦50', callback_data: '50' }], [{ text: '₦100', callback_data: '100' }], [{ text: '₦150', callback_data: '150' }], [{ text: '₦200', callback_data: '200' }], [{ text: '₦250', callback_data: '250' }], [{ text: '₦300', callback_data: '300' }], [{ text: '₦350', callback_data: '350' }], [{ text: '₦400', callback_data: '400' }], [{ text: '₦450', callback_data: '450' }], [{ text: '₦500', callback_data: '500' }], [{ text: '🔙 Back', callback_data: 'airtimeOpt' }] ] } };
        
            bot.editMessageText(`Enter Airtime amount:`, {
                chat_id: chatId,
                message_id: msgId,
                reply_markup: options.reply_markup,
            });
            
        } else if (!isAirtime && isPhone) {
            if (phone) {
                amount = extractNairaAmount(textValue);
                const options = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                        [{ text: `Pay ₦${amount}`, callback_data: 'buydata'  }],
                        [{ text: '🔙 Back', callback_data: 'dataOpt' }],
                        [{ text: 'Cancel Request', callback_data: 'option1' }],
                        ]
                    })
                };
                bot.editMessageText(`Confirm your request for ₦${extractDataAmount(textValue)} to ${phone}:`, {
                    chat_id: chatId,
                    message_id: msgId,
                    reply_markup: options.reply_markup,
                });
            }
    
        }; 
      
    });
    
    bot.onText(/^\d{8}+[NOPACBDEFH]{2}$/, (msg) => { //
        const chatId = msg.chat.id;
        referenceId = msg.text;
        if (ref) {
            // Store the phone number
            bot.editMessageText('Receipt Loading...', {
                chat_id: chatId,
                message_id: msgId,
            }).then(() => {
                const id = { TId: chatId, referenceId }
                const receipt = userfinder(key[7], id)
                const options = { reply_markup: { inline_keyboard: [ [{ text: 'Delete Transaction', callback_data: 'del' }], [{ text: 'Verify Transaction', callback_data: 'verify' }], [{ text: '🔙 Back', callback_data: 'mainMenu' }] ] } };
                bot.editMessageText(receipt, {
                    chat_id: chatId,
                    message_id: msgId,
                    reply_markup: options.reply_markup,
                })
            });
        }
      
    });
    
    bot.onText(/^\$\d{13}+[MTSEGHNADOO]{10}+@$/, (msg) => { // 
        const chatId = msg.chat.id;
        if (aut) {
            const id = { TId: chatId, aut: msg.text }
            
            bot.editMessageText('Processing Request...', {
                chat_id: chatId,
                message_id: msgId,
            }).then(() => {
                const login = userfinder(key[5], id)
                bot.editMessageText(login, {
                    chat_id: chatId,
                    message_id: msgId,
                })
            });
        }
      
    });

    bot.onText(/^[a-zA-Z0-9._%+-~!@#$^&*()+{}:"|\/';./,?<>¡]{4,}$/, (msg) => { // Matches any character
        const chatId = msg.chat.id;
        if (cpass) {
            oldPasscode = msg.text
            bot.editMessageText('Enter New Passcode', {
                chat_id: chatId,
                message_id: msgId,
            }).then(() => {
                cpass = false;
                ncpass = true;
            });
        } else if (ncpass) {
            const passcode = msg.text
            bot.editMessageText('Updating Passcode', {
                chat_id: chatId,
                message_id: msgId,
            }).then(() => {
                const id = { TId: chatId, oldPasscode: oldPasscode, passcode: passcode }
                const npc = userfinder(key[5], id)
                bot.editMessageText(npc, {
                    chat_id: chatId,
                    message_id: msgId,
                })
            });
        } else if (a) {
            const passcode = msg.text
            bot.editMessageText('Passcode Received', {
                chat_id: chatId,
                message_id: msgId,
            }).then(() => {
                const id = { passcode: passcode, TId: chatId }
                const register = userfinder(key[3], id)
                sendStartMessage(chatId, register);
            });
        }  else if (b) {
            const bug = msg.text
            const chatId = msg.chat.id;
                bot.editMessageText('We have received your message. Our team will fix it as soon as possible. Thank you for using Vendor Bot.', {
                    chat_id: chatId,
                    message_id: msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '🔙 Back', callback_data: 'mainMenu'}],
                        ]
                    })
                }).then(() => {
                    c = chatId;
                    const options = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: `View account`, callback_data: 'handleBug' }],
                                [{ text: 'Suspend account', callback_data: 'suspend' }],
                                [{ text: 'Handle request', callback_data: 'mainMenu'}],
                            ]
                        })
                    }
                    bot.sendMessage(process.env.TID, bug, options)
                });
        } else {
            return; // Todo return quick response 'Message not validated please check message.'
        }
    });

    bot.on('polling_error', (error) => {
        console.error('Polling error:', error.code, '\n', error.message, '\n', error.stack);
    });
    
     
}).catch((err) => {
    console.log(err)
})

     







/*
Unhandled rejection Error: ETELEGRAM: 400 Bad Request: message to edit not found
    at C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\node_modules\node-telegram-bot-api\src\telegram.js:316:15
    at process.processImmediate (node:internal/timers:476:21)
From previous event:
    at Request.RP$exposed [as then] (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\node_modules\request-promise-core\lib\plumbing.js:145:61)
    at TelegramBot._request (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\node_modules\node-telegram-bot-api\src\telegram.js:304:8)
    at TelegramBot.editMessageText (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\node_modules\node-telegram-bot-api\src\telegram.js:2450:17)
    at sendMainMenu (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\message.js:244:13)
    at handle_message (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\message.js:21:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async TelegramBot.<anonymous> (C:\Users\PHILIP\Desktop\web dev\FSprojects\Merch_app\watsAppVendorBot\bot\bot1.js:31:9)*/

    // when the u clears the chat or the message is deleted how do i handle this case. another case is when the user 




    const TelegramBot = require('node-telegram-bot-api');

    
    // Function to send or update the main menu
    
    // Example usage
    