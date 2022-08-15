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

    const message = await fetch(queryStr, "s2sEvent")
    console.log(message)
    const blockNumber = message.block.number

    return {
        messageKey: `${blockNumber}-${params.messageId}`, // dirname
        messageData: message, // file content
        nextHandler: {
            name: "kusama",
            params: {
                messageId: params.messageId
            }
        }
    }
}

