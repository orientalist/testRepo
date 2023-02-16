const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const axios = require('axios');

exports.handler = async (event, context) => {
    const code = event.code;

    main(code);
};

main = async (code) => {
    try {
        const clientId = '354082970050-gvst203l9ohcmct9t5d4krp1gl8q4niu.apps.googleusercontent.com';
        const secret = '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';
        const redirectUri = 'https://www.def.com';

        const oauth2Client = new OAuth2(
            clientId, // 註冊 Google API 並取得的 client ID
            secret, // 註冊 Google API 並取得的 client secret
            redirectUri // 註冊 Google API 並設定的 redirect URI
        );

        const { tokens } = await oauth2Client.getToken(code);

        const placeId = 'ChIJnTjc6p2rQjQR5gmyNNSM_Jw';
        const apiKey = 'AIzaSyDLeoZSm_pCOHYPsO2b7V2jm4t60jMQdoQ';
        const apiEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

        console.log(apiEndpoint);
        const review = {
            language: 'en-US',
            text: 'Very Nice',
            rating: 5
        };

        const response =await axios.post(apiEndpoint, review, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        console.log('-------------------------');
        console.log(response.data);
        console.log('-------------------------');

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };

    } catch (err) {
        console.log(err);
    }
}

main('4/0AWtgzh4E-vysPZJkL90lQIRE5JBigTV6M7my6yAtrJilZ8Vd5Bjzz0oa04OihxhUQINmrg');