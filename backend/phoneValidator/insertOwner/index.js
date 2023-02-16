const AWS = require('aws-sdk');
const fetch = require('node-fetch');

AWS.config.update({
    credentials: {
        accessKeyId: 'AKIA2I632YO6VLUFNYGA',
        secretAccessKey: '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'
    }, region: 'ap-northeast-1'
});
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const body = event.body;

        const SVID = body.split('&')[0].split('=')[1];
        const HASH = body.split('&')[1].split('=')[1];;

        await main(SVID, HASH);
    } catch (err) {
        console.log(err);
    }

}

const main = async (SVID, HASH) => {

    const decryptor_url = `https://m4fmwypkjcyxdfgz2nkhdatriy0uopqq.lambda-url.ap-northeast-1.on.aws?svid=${SVID}&hash=${HASH}`;
    const surveyResp = await fetch(decryptor_url);
    const surveyData = await surveyResp.json();
    let phoneNumber = null;

    const selectedCouponType = surveyData.result.filter(r => r.alias === 'coupon_type')[0].answerAlias[0];

    const ownerJson = await (await getOwnerJson()).body;


    switch (selectedCouponType) {
        case "paper":
            phoneNumber = surveyData.result.filter(r => r.alias === 'phone_number_paper')[0].answer[0];
            ownerJson.paperOwner.push(phoneNumber);
            break;
        case "ec":
            phoneNumber = surveyData.result.filter(r => r.alias === 'phone_number_ec')[0].answer[0];
            ownerJson.ecOwner.push(phoneNumber);
            break;
        default:
            return;
    }

    try {
        const params = {
            Bucket: 'test-storage-20221023',
            Key: 'owner.json',
            Body: Buffer.from(JSON.stringify(ownerJson))
        };

        const result = await s3.putObject(params).promise();
    } catch (err) {
        console.log(err);
    }

}

const getOwnerJson = async () => {
    const params = {
        Bucket: 'test-storage-20221023',
        Key: 'owner.json'
    };

    try {
        // 讀取 S3 中的 JSON 檔案
        const data = await s3.getObject(params).promise();
        //console.log(data);

        // 將 JSON 檔案轉換為 JavaScript 物件
        const fileContent = JSON.parse(data.Body.toString());

        // 執行讀取 JSON 檔案後的其他操作
        return {
            statusCode: 200,
            body: fileContent
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            })
        };
    }
}