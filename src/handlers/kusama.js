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

    return {
        messageData: message
    }
}