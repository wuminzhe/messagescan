const fetch = require('../fetch.js').fetch('http://localhost:3000');

const buildQueryStr = messageId => {
    return `{  
        query {
            s2sEvent(id: "${messageId}") {
                id
                laneId
                nonce
                requestTxHash
                senderId
                block
            }
        }
    }`
}

exports.handle = async (params) => {
    const queryStr = buildQueryStr(params.messageId)

    const message = await fetch(queryStr)
    const blockNumber = message.data.query.s2sEvent.block.number

    return {
        messageKey: `${blockNumber}-${params.messageId}`, // dirname
        messageData: JSON.stringify(message.data.query.s2sEvent), // file content
        nextHandler: {
            name: "kusama",
            params: {
                messageId: params.messageId
            }
        }
    }
}

