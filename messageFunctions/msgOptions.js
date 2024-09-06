const { stringify, option, dateformat } = require("./botfunction");

const receiptOpt = stringify([
    [{ text: 'Download Receipt', callback_data: 'del' }],
    [option('Contact', JSON.stringify({ type: 'contact', value: 'buy' }))],
    [{ text: '🔙 Back', callback_data: 'history' }]
]);

const receiptFormat = (success, buy) => {
    return `${success}\nTransaction Info\nTransaction Date: ${dateformat(buy.date)}\nReference Id: ${buy.referenceId}\n${buy.type}: ${buy.description}\nNetwork: ${buy.provider}\nAmount: ${buy.amount}\nStatus: ${buy.status}`;
}

module.exports = {
    receiptOpt,
    receiptFormat
}