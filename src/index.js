const Queue = require('bee-queue');
const crabParachainQueue = new Queue("crab_parachain")
const fetch = require('./fetch.js').fetch('http://localhost:3000');

const { sleep } = require('./utils.js')

const buildQueryStr = (size, after) => {
    let from = '' 
    if(after) { 
        from = `after: "${after}",`
    }

    return `{  
        query {
            s2sEvents(first: ${size}, ${from} orderBy: START_TIMESTAMP_ASC) {
                nodes {
                    id
                    startTimestamp
                }
                edges {
                    cursor
                }
            }
        }
    }`
}

const addJob = (crabParachainQueue, messageId) => {
    const job = crabParachainQueue.createJob({ messageId: messageId });
    job
        .timeout(3000)
        .retries(2)
        .save()
}

const main = async () => {
    console.log(require("path").basename(__filename).split(".")[0])
    let cursor = undefined;
    while(true) {
        const query = buildQueryStr(2, cursor)
        const result = await fetch(query)
        const nodes = result.data.query.s2sEvents.nodes;
        if(nodes.length > 0) {
            const edges = result.data.query.s2sEvents.edges;
            cursor = edges[edges.length-1].cursor
            for(let i = 0; i < nodes.length; i++) {
                console.log(nodes[i].id)
                addJob(crabParachainQueue, nodes[i].id)
                
            }
            console.log("--------------")
        } else {
            await sleep(6000 * 10)
        }
        
    }
        
}
main().catch(console.error).finally(() => process.exit());