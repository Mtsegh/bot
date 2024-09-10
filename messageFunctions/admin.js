const { search, getAllUsers, getUserInfo } = require("../controllers/adminController");
const errorHandler = require("../middleware/errorMiddleware");
const { generateReferenceId } = require("../middleware/userMiddleware");
const Contact = require("../models/adminModel");
const { updateUserState, resetUserState, getUserStateFromDB } = require("../states");
const { menu, stringify, dateformat, callback, option } = require("./botfunction");
const { sendMessage, editMessage, deleteMessage } = require("./sender");

const Admin = async(bot, admin, bugAccount, action) => {
    const state = await getUserStateFromDB(admin);
    const TId = bugAccount.telegramId
    updateUserState(admin, { contact: bugAccount })
    switch (action) {
        
        case 'menu':
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [callback(`Transaction as admin`, admin, "tranx")],
                        [callback('View users', admin, "allUsers")],
                        [callback('TCD API', admin, "API")],
                        [{ text: 'Account Info', callback_data: 'option2'}],
                    ]
                })
            }
            resetUserState(admin)
            deleteMessage(bot, admin, state.msgId)
            await sendMessage(bot, admin, "Admin, select option below", options);
            break;

        case 'allUsers':
            try {
                sendMessage(bot, admin, 'Getting Users...').then(async(msg) => {
                    resetUserState(admin)
                    getAllUsers(admin).then(async(users) => {
                        if (users.message||users.error) {
                            await errorHandler(bot, admin, msg, users.message||users.error, null, true);
                        } else {                        
                            const usersOpt = users.map(user => ({
                                text: `${user.name} ${user.balance}`,
                                callback_data: JSON.stringify({
                                    type: "admin",
                                    user: user.telegramId,
                                    action: "getUser",
                                })
                            }));
                            
                            const userOpt = [callback('Search', TId, "search"), ...usersOpt]
                            userOpt.push(menu(admin));
                        
                            const options = stringify(userOpt.map(user => [{ text: user.text, callback_data: user.callback_data }]));
                        
                            await editMessage(bot, `No. of users found: ${users.length}\nSelect user to view details`, {
                                chat_id: admin,
                                message_id: msg,
                                reply_markup: options.reply_markup
                            });
                        }
                    })
                });
            } catch (error) {
                await errorHandler(bot, chatId, state.msgId, `Please refresh and try again`, {}, false);
            }
            break;
            
        case 'getUser':
            try {
                sendMessage(bot, admin, 'Getting User info...').then(async(msg) => {
                    await getUserInfo(admin, TId).then(async(info) => {
                        if (info.message||info.error) {
                            await errorHandler(bot, admin, msg, info.message||info.error, { admin: TId, back: 'allUser' }, true);
                        } else {
                            const options = stringify([
                                [callback('Transaction', TId, "tranx")],
                                [callback('Update balance', TId, "userDeposit")],
                                [callback(info.text.admin, TId, "makeAdmin")],
                                [callback(info.text.accountStatus, TId, "suspend")],
                                [callback('Message', TId, "chat")],
                            ]);                   
                            await editMessage(bot, `Heres the info AUT: ${info.AUT}, \nBalance: ${info.balance}, \nDetails: ${info.details}, \nTId: ${info.telegramId}`, {
                                chat_id: admin,
                                message_id: msg,
                                reply_markup: options.reply_markup
                            });
                        }
                    })
                });
            } catch (error) {
                console.error(error);
                await errorHandler(bot, chatId, state.msgId, `Please refresh and try again`, {}, false);
            }
            break;
    
        case 'tranx':
            try {
                deleteMessage(bot, admin, state.msgId);
                await sendMessage(bot, admin, `Select a purchase option:`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Buy Data', callback_data: 'dataOpt' }],
                            [{ text: 'Buy Airtime', callback_data: 'airtimeOpt' }],
                            [{ text: 'Make Deposit', callback_data: 'depositOpt' }],
                            [{ text: 'View History', callback_data: 'history' }],
                            [menu(admin)],
                        ],
                    }),
                });
            } catch (error) {
                console.error(error);
                await errorHandler(bot, chatId, state.msgId, `Please refresh and try again`, {}, false);
            }
            
            break;
        
        case 'API':
            deleteMessage(bot, admin, state.msgId)
            await sendMessage(bot, admin, `Handle your API:`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [callback('TCD Details', admin, "api_user")],
                        [callback('API Data history', admin, "api_datory")],
                        [callback('API Airtime history', admin, "api_airtory")],
                        [menu(admin)],
                    ],
                }),
            });
            
            break;
        
        default:
            if (action === 'suspend' || action === 'toVerified' || action === 'makeAdmin' || action === 'api_datory' || action === 'api_airtory' || action === 'api_user') {
                updateUserState(admin, { authaction: action, auth: true, isAdmin: true });
                console.log(TId);
                
                await editMessage(bot, 'Enter Password to continue...', {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [callback('Cancel', admin, "menu")],
                        ],
                    }),
                });
            } else if (action === 'userDeposit' || action === 'search' || action === 'chat' ) {
                const text = action === 'userDeposit' ? "Enter amount to deposit" : action === 'search' ? 'Please use "key: value" format.\nEnter your search to continue...' : `Enter message for User~${bugAccount.name}`;
                updateUserState(admin, { authaction: action, text: true, isAdmin: true });
                await editMessage(bot, text, {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [callback('Cancel', admin, "menu")],
                        ],
                    }),
                });
            } else {
                console.log(action);
                await editMessage(bot, "Invalid selection. Please choose a valid option.", {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [menu(admin)],
                        ],
                    }),
                });
            }
            break;
    }
}


class Contactadmin {
    static async send(bot, bug, TId) {
        try {
            const contactId = generateReferenceId('ZWQRTULYVX');
            const d = new Date();
            const date = dateformat(d);
            const admins = await search({admin:true});
            console.log(admins);
            const msgs = {}
            admins.forEach(async(admin) => {
                try {
                    sendMessage(bot, admin.telegramId, `${date}\n${contactId}\n\n${bug}`, stringify([
                        [callback('View Account', TId, "getUser")],
                        [option('Resolved', `bug_${contactId}`)],
                        [menu(admin.telegramId)],
                    ])).then(async(msg) => {
                        updateUserState(admin.telegramId, {msgId: null})
                        msgs[admin.telegramId] = msg;
                    });                
                } catch (error) {
                    console.error('Error in sending to all admins: ', error);
                }
            });
            
            await Contact.create({
                chatId: TId,
                contactId: contactId,
                msgId: msgs,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error saving contact or sending: ', error);
        }
    }

    static async update(contactId) {
        try {
            const date = dateformat(user.timestamp);
            const admins = await search({admin:true});
    
            admins.forEach(async(admin) => {
                try {                
                    const issue = await Contact.findOne(contactId);
                    
                    await editMessage(bot, `${date}\n${issue.contactId} has been resolved.`, {
                        chat_id: admin.telegramId,
                        message_id: issue.msgId[admin.telegramId]
                    })
                } catch (error) {
                    console.error('Error in Update: ', error);
                }
            });  
        } catch (error) {
            console.error('Error in Update: ', error);
            
        }
    }
}



module.exports = {
    Admin,
    Contactadmin
};