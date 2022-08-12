const { mkdir, writeFile, sleep } = require('./utils.js')
const Queue = require('bee-queue');

const save = (filename, dirname, content) => {
    const path = `../data/${dirname}`
    mkdir(path)
    writeFile(`${path}/${filename}.json`, content)
}

const addJob = (queueName, params) => {
    const queue = new Queue(queueName)
    const job = queue.createJob(params);
    job.timeout(3000).retries(2).save()
}

const next = async (currentHandlerName, nextHandler) => {
    if (nextHandler.name) {
        if (nextHandler.name == currentHandlerName) {
            await sleep(2000)
        }

        if (!nextHandler.params) {
            nextHandler.params = {}
        }

        addJob(nextHandler.name, nextHandler.params)
    }
}


const handle = async (handlerName, handler, params) => {
    const result = await handler.handle(params)
    const messageKey = result.messageKey || params.messageKey

    if (!messageKey) {
        throw new Error(`Missing 'messageKey' in params or result of handler '${handlerName}'.`)
    }

    // add message key
    let nextHandler = null
    if (result.nextHandler && result.nextHandler.name) {
        nextHandler = {
            name: result.nextHandler.name,
            params: result.nextHandler.params || {}
        }
        nextHandler.params.messageKey = messageKey
    }

    return {
        messageKey: messageKey,
        messageData: result.messageData,
        nextHandler: nextHandler
    }
}

exports.start = async (handlerName, handler) => {
    new Queue(handlerName).process(10, async (job) => {
        try {
            const result = await handle(handlerName, handler, job.data)

            // console.debug(result)
            if (result.messageKey && result.messageData) {

                save(handlerName, result.messageKey, result.messageData)

                if (result.nextHandler) {
                    await next(handlerName, result.nextHandler)
                }

            }
        } catch (err) {
            console.error(err)
        }

        return null
    });
    console.log(`${handlerName} worker is running`)
}

