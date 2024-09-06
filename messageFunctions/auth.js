const { updateUserState, getUserStateFromDB, resetUserState } = require("../states");
const User = require("../models/userModel");
const { makePurchase, makeDeposit } = require("../controllers/userController");
const { menu, callback, stringify, getValidity, parseInput } = require("./botfunction");
const { search, getAllUsers, setAdmin, getUserInfo, changeUserStatus } = require("../controllers/adminController");
const errorHandler = require("../middleware/errorMiddleware");
const { sendMessage, editMessage } = require("./sender");
const { receiptOpt, receiptFormat } = require("./msgoptions");
const { api_airtory, api_datory, api_user } = require("../api/api");
const service = ['data', 'airtime'];
    
const secured = async(bot, authaction, chatId, msgId) => {
    const user = await User.findOne({telegramId:chatId});
    const state = await getUserStateFromDB(chatId)
    const userId = user.admin && state.bugAccountId ? state.buAccountId : chatId;
    console.log(bot, authaction, chatId, msgId);
    if (authaction==="buydata") {
        try {
            editMessage(bot, 'Transaction processing...', {chat_id: chatId, message_id: msgId}).then(async() => {
                const info = { amount: state.amount, network_id: state.network_id, plan_id: state.plan_id, 
                    purchase: 'Data Purchase', validity: getValidity(state.textValue) }
                
                makePurchase(userId, service[0], info).then(async(buy) => {
                    if (buy.message||buy.error) {
                        await errorHandler(bot, chatId, state.msgId, buy.message||buy.error, { contact: 'buy', back: 'dataOpt', admin: state.bugAccountId }, user.admin);
                    } else {                        
                
                        await editMessage(bot, receiptFormat(buy.success, buy.newHistory), {
                            chat_id: chatId,
                            message_id: state.msgId,
                            reply_markup: receiptOpt.reply_markup,
                        })
                    }
                })
            });
        } catch (error) {
            await errorHandler(bot, chatId, state.msgId, `Transaction failed. Try again.\nIf issue persists contact admin`, { contact: 'buy', back: 'dataOpt', admin: state.bugAccountId }, user.admin);
        }
    } else if (authaction==="airtime") {
        try {
            editMessage(bot, 'Transaction processing...', {chat_id: chatId, message_id: msgId});
            const info = { amount: state.amount, network_id: state.network_id, purchase: 'Airtime Purchase', validity: 'Validated' }
            makePurchase(userId, service[1], info).then(async(buy) => {
                if (buy.message||buy.error) {
                    await errorHandler(bot, chatId, state.msgId, buy.message||buy.error, { contact: 'buy', back: 'dataOpt', admin: state.bugAccountId }, user.admin);
                } else {                        
                    
                    await editMessage(bot, receiptFormat(buy.success, buy.newHistory), {
                        chat_id: chatId,
                        message_id: state.msgId,
                        reply_markup: receiptOpt.reply_markup,
                    })
                }
            });
        } catch (error) {
            await errorHandler(bot, chatId, state.msgId, `Transaction failed. Try again.\nIf issue persists contact admin`, { contact: 'buy', back: 'airtimeOpt', admin: userId });
        }
    }
}

const Adminauth = async(bot, admin, TId, action) => {
    console.log('admin, TId, action', admin, TId, action);
    const state = await getUserStateFromDB(admin)
    switch (action) {
        case 'allUsers':
            sendMessage(bot, admin, 'Getting Users...').then(async(msg) => {
                getAllUsers(admin).then(async(users) => {
                    if (users.message||users.error) {
                        await errorHandler(bot, admin, msg, users.message||users.error, null, true);
                    } else {                        
                        const userOpt = users.map(user => ({
                            text: `${user.name} ${user.balance}`,
                            callback_data: JSON.stringify({
                                type: "admin",
                                user: user.telegramId,
                                action: "getUser",
                            })
                        }));
                        
                        userOpt.push(callback('Search User', TId, "search"),
                        menu(admin));
                    
                        const options = stringify(userOpt.map(user => [{ text: user.text, callback_data: user.callback_data }]));
                    
                        await editMessage(bot, 'Here are a list of all VB users', {
                            chat_id: admin,
                            message_id: msg,
                            reply_markup: options.reply_markup
                        });
                    }
                }).then(async() => {
                    await resetUserState(admin)
                });
            });
            break;

        case 'getUser':
            sendMessage(bot, admin, 'Getting User info...').then(async(msg) => {
                await getUserInfo(admin, TId).then(async(info) => {
                    if (info.message||info.error) {
                        await errorHandler(bot, admin, msg, info.message||info.error, { admin: TId, back: 'allUser' }, true);
                    } else {
                        const options = stringify([
                            [callback('Transaction', TId, "tranx")],
                            [callback('Update balance', TId, "userDeposit")],
                            [callback('Make Admin', TId, "makeAdmin")],
                            [callback('Suspend', TId, "suspend")],
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
            break;

        case 'suspend':
            await bot.sendMessage(admin, 'Suspending user...').then(async(msg) => {
                await changeUserStatus(admin, TId, 'suspend').then(async(status) => {
                    if (status.message||status.error) {
                        await errorHandler(bot, admin, msg, status.message||status.error, { admin: TId, back: 'getUser' }, true);
                    } else {                        
                        await editMessage(bot, `User status changed to ${status}`, {
                            chat_id: admin,
                            message_id: msg,
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [callback('Verify account', TId, "toVerify")],
                                    [menu(admin)],
                                ]
                            })
                        });
                    }
                })
            });
            break;
    
        case 'userDeposit':
            await sendMessage(bot, admin, 'Updating user balance...').then(async(msg) => {
                const info = { amount: state.textValue, status: 'completed'}
                makeDeposit(TId, 'Manual', info).then(async(deposit) => {
                    if (deposit.message||deposit.error) {
                        await errorHandler(bot, admin, msg, deposit.message||deposit.error, { admin: TId, back: 'getUser' }, true);
                    } else {                        
                        await editMessage(bot, `${deposit.success}`, {
                            chat_id: admin,
                            message_id: msg,
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [callback('Transaction', TId, "tranx")],
                                    [callback('Suspend', TId, "suspend")],
                                    [menu(admin)],
                                ]
                            })
                        });
                    }
                })
            });
            break;
    
        case 'toVerified':
            await sendMessage(bot, admin, 'Verifying user...').then(async(msg) => {
                await changeUserStatus(admin, TId, 'verified').then(async(status) => {
                    if (status.message||status.error) {
                        await errorHandler(bot, admin, msg, status.message||status.error, { admin: TId, back: 'getUser' }, true);
                    } else {                        
                        await editMessage(bot, `User status changed to ${status}`, {
                            chat_id: admin,
                            message_id: msg,
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [callback('Transaction', TId, "tranx")],
                                    [callback('Suspend', TId, "suspend")],
                                    [callback('Finish', admin, "menu")],
                                ]
                            })
                        });
                    }
                })
            });
            break;   
            
        case 'search':
            await sendMessage(bot, admin, 'Searching user...').then(async (msg) => {
                const parsed = parseInput(state.textValue)
                const result = await search(parsed);
        
                if (result.message||result.error) {
                    // Handle the case where no users are found
                    await errorHandler(bot, admin, msg, result.message||result.error, { admin: TId, back: 'allUser' }, true);
                } else {
                    // Handle the case where users are found
                    const inlineKeyboard = result.map(user => ([{
                        text: `${user.name} ${user.telegramId}`,
                        callback_data: JSON.stringify({
                            type: "admin",
                            user: user.telegramId,
                            action: "getUser",
                        })
                    }]));
        
                    await editMessage(bot, 'Here are all the users that match your criteria:', {
                        chat_id: admin,
                        message_id: msg,
                        reply_markup: JSON.stringify({
                            inline_keyboard: inlineKeyboard
                        })
                    });
                }
            });
            break;
            
        case 'makeAdmin':
            await updateUserState(admin, { buAccountId: TId })
            await sendMessage(bot, admin, `Removing User-${TId} from admin role...`).then((msg) => {
                setAdmin(TId, true).then(async(make) => {
                    
                    if (make.message||make.error) {
                        await errorHandler(bot, admin, msg, `${make.message||make.error}`, { admin: TId, back: 'getUser' }, true)
                        return;
                    }
                    await editMessage(bot, make.success, {
                        chat_id: admin,
                        message_id: msg,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [callback('🔙 Back', TId, "getUser")],
                                [menu(admin)],
                            ],
                        }),
                    })
                    await updateUserState(admin, { retry: false })
                });
            });
            break;
    
        case 'removeAdmin':
            await updateUserState(admin, { buAccountId: TId })
            await sendMessage(bot, admin, `Removing User-${TId} from admin role...`).then((msg) => {
                setAdmin(TId, false).then(async(remove) => {
                    
                    if (remove.message||remove.error) {
                        await errorHandler(bot, admin, msg, `${remove.message||remove.error}`, { admin: TId, back: 'getUser' }, true)
                        return;
                    }
                    await editMessage(bot, remove.success, {
                        chat_id: admin,
                        message_id: msg,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [callback('🔙 Back', TId, "getUser")],
                                [menu(admin)],
                            ],
                        }),
                    })
                    await updateUserState(admin, { retry: false })
                });
            });
         
        case 'chat':
            await updateUserState(admin, { buAccountId: TId })
            const send = await sendMessage(bot, TId, `Admin message: ${state.textValue}`)
            if (send) {                
                await editMessage(bot, 'Message sent successfully', {
                    chat_id: admin,
                    message_id: state.msgId,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [callback('🔙 Back', TId, "getUser")],
                            [menu(admin)],
                        ],
                    }),
                })
            }
            await updateUserState(admin, { retry: false });
            break;
        
        default:
            if (action==='api_airtory' || action==='api_datory') {
                await sendMessage(bot, admin, `Loading API history...`).then(async(msg) => {
                    const history = action==='api_airtory' ? await api_airtory() : await api_datory();
                    if (history.message||history.error) {
                        await errorHandler(bot, admin, msg, `${history.message||history.error}`, { admin: TId, back: 'getUser' }, true)
                        return;
                    }
                    const historyOpt = history.map(tory => ({
                        text: `${tory.service} ${tory.amount}`,
                        callback_data: JSON.stringify({
                            type: "admin",
                            user: tory.id,
                            action: "getreceipt",
                        })
                    }));
                    historyOpt.push(menu(admin));
                    
                    const options = stringify(historyOpt.map(tory => [{ text: tory.text, callback_data: tory.callback_data }]));
                    await editMessage(bot, "Here's a list of all API transactions", {
                            chat_id: admin,
                            message_id: msg,
                            reply_markup: options.reply_markup,
                    })
                    updateUserState(admin, { retry: false });
                });
                
            } else if (action==='getreceipt') {
                // TODO 
            } else if (action === 'api_user') {
                const userdetails = await api_user();

            } else {                
                console.log(action)
                await errorHandler(bot, admin, state.msgId, "Invalid selection. Please choose a valid option.", null, true)
            }
            break;
    }
}

module.exports = {
    secured,
    Adminauth
};