const { stringify, option, dateformat } = require("./botfunction");

const receiptOpt = stringify([
    [option('Download Receipt', 'download')],
    [option('Contact', JSON.stringify({ type: 'contact', value: 'buy' }))],
    [{ text: '🔙 Back', callback_data: 'history' }]
]);

const receiptFormat = (success, buy) => {
    return `${success}\nTransaction Info\nTransaction Date: ${dateformat(buy.updatedAt)}\nReference Id: ${buy.referenceId}\n${buy.type}: ${buy.description}\nNetwork: ${buy.provider}\nAmount: ${buy.amount}\nStatus: ${buy.status}`;
}

const AirtimeAmounts = stringify([
    [{ text: '₦50', callback_data: '50' }],
    [{ text: '₦100', callback_data: '100' }],
    [{ text: '₦150', callback_data: '150' }],
    [{ text: '₦200', callback_data: '200' }],
    [{ text: '₦250', callback_data: '250' }],
    [{ text: '₦300', callback_data: '300' }],
    [{ text: '₦350', callback_data: '350' }],
    [{ text: '₦400', callback_data: '400' }],
    [{ text: '₦450', callback_data: '450' }],
    [{ text: '₦500', callback_data: '500' }],
    [{ text: '🔙 Back', callback_data: 'airtimeOpt' }]
]);

module.exports = {
    receiptOpt,
    receiptFormat,
    AirtimeAmounts
}