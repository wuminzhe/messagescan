const axios = require('axios');
const { curry } = require('ramda');

const fetch = async (url, queryStr) => {
    try {
        const resp = await axios.post(url, { "query": queryStr })
        return resp.data
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}
// 'http://localhost:3000'

//fetch(queryStr)

exports.fetch = curry(fetch);
