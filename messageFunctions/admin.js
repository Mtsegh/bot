const { search } = require("../controllers/adminController");
const { generateReferenceId } = require("../middleware/userMiddleware");
const Contact = require("../models/adminModel");
const { updateUserState, resetUserState, getUserStateFromDB } = require("../states");
const { menu, stringify, dateformat, callback } = require("./botfunction");
const { sendMessage, editMessage, deleteMessage } = require("./sender");

const Admin = async(bot, admin, TId, action) => {
    console.log('admin, TId, action', admin, TId, action);
    const state = await getUserStateFromDB(admin);
    console.log(state.msgId);
    
    await updateUserState(admin, { buAccountId: TId })
    switch (action) {
        case 'menu':
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [callback(`Transaction as admin`, admin, "tranx")],
                        [callback('View users', admin, "allUsers")],
                        [{ text: 'Account Info', callback_data: 'option2'}],
                    ]
                })
            }
            resetUserState(admin)
            deleteMessage(bot, admin, state.msgId)
            await sendMessage(bot, admin, "Admin, select option below", options);
            break;

        case 'tranx':
            deleteMessage(bot, admin, state.msgId)
            await updateUserState(admin, { buAccountId: TId })
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
            
            break;
        
        case 'status':
            await sendMessage(bot, admin, `User status will affect their access to vendor bot`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [callback('Suspend User', TId, "suspend")],
                        [callback('API Data history', TId, "toVerify")],
                        [menu(admin)],
                    ],
                }),
            });
            break 
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
        
        case 'userIssueResolved':
            await Contactadmin.update(TId)
            break;

        default:
            if (action === 'allUsers' || action === 'getUser' || action === 'suspend' || action === 'toVerified' || action === 'makeAdmin' || action === 'api_datory' || action === 'api_airtory' || action === 'api_user') {
                updateUserState(admin, { authaction: action, auth: true, buAccountId: TId, isAdmin: true });
                await editMessage(bot, 'Enter Password to continue...', {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [menu(admin)],
                        ],
                    }),
                });
            } else if (action === 'userDeposit' || action === 'search' || action === 'chat' ) {
                const text = action === 'userDeposit' ? "Enter amount to deposit" : action === 'search' ? 'Please use "key: value" format.\nEnter your search to continue...' : `Enter message for User~${TId}`;
                updateUserState(admin, { authaction: action, text: true, bugAccountId: TId, isAdmin: true });
                await editMessage(bot, text, {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [menu(admin)],
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
            console.log(admins)
            const msgs = {}
            admins.forEach(async(admin) => {
                try {
                    const options = stringify([
                            [callback('View Account', TId, "getUser")],
                            [callback('Suspend', TId, "suspend")],
                            [callback('Resolved', contactId, "userIssueResolved")],
                            [menu(admin.telegramId)],
                        ])
                    sendMessage(bot, admin.telegramId, `${date}\n${contactId}\n\n${bug}`, options).then(async(msg) => {
                        msgs[admin.telegramId] = msg
                    });                
                } catch (error) {
                    console.error('Error in send to all admins: ', error);
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