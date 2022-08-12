const Arena = require('bull-arena');
const express = require('express');
const app = express()
const router = express.Router();
const Bee = require('bee-queue');

const arena = Arena({
    Bee,
    queues: [
        {
            // Required for each queue definition.
            name: 'crab_parachain',

            // User-readable display name for the host. Required.
            hostId: 'Server 1',

            // Queue type (Bull or Bee - default Bull).
            type: 'bee'
        },
        {
            // Required for each queue definition.
            name: 'kusama',

            // User-readable display name for the host. Required.
            hostId: 'Server 1',

            // Queue type (Bull or Bee - default Bull).
            type: 'bee'
        },
    ],



}, {
    // Make the arena dashboard become available at {my-site.com}/arena.
    basePath: '/arena',

    // Let express handle the listening.
    disableListen: true,
});

router.use('/', arena);
app.use(router)

app.listen(2000, () => {
    console.log('Ready, http://localhost:2000/arena')
})