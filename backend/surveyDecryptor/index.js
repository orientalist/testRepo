const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

exports.handler = async (event) => {
    const SVID = event.queryStringParameters.svid;
    const HASH = event.queryStringParameters.hash;
    const domain = event.queryStringParameters.domain;

    let survey_json = await decryptor(HASH, SVID, domain);
    survey_json = JSON.parse(survey_json);

    const response = {
        statusCode: 200,
        body: survey_json,
    };
    return response;
};

const decryptor = async function (hash, svid, domain) {

    let SURVEYCAKE_DOMAIN = (domain !== null && domain !== undefined) ? domain : "www.surveycake.com";
    let VERSION = "v0";

    const file = fs.readFileSync('./config.json');
    const config = JSON.parse(file);
    let hash_key = config[SURVEYCAKE_DOMAIN][svid].hashKey;
    let iv_key = config[SURVEYCAKE_DOMAIN][svid].ivKey;

    let resp = await axios.get(`https://${SURVEYCAKE_DOMAIN}/webhook/${VERSION}/${svid}/${hash}`);

    let data = resp.data;

    const decipher = crypto.createDecipheriv(
        'AES-128-CBC',
        hash_key,
        iv_key
    );

    let json = decipher.update(
        data,
        'base64',
        'utf8'
    );

    json += decipher.final('utf8');

    return json;
};