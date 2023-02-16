const AWS = require('aws-sdk');

const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': 'https://www.surveycake.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

AWS.config.update({
    credentials: {
        accessKeyId: 'AKIA2I632YO6VLUFNYGA',
        secretAccessKey: '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'
    }, region: 'ap-northeast-1'
});
const s3 = new AWS.S3();

exports.handler = async (event) => {

    const requestBody = JSON.parse(event.body);
    let phoneNumber = '';
    let owners = [];
    phoneNumber = requestBody.value;

    if (phoneNumber) {
        const paperOwnersJson = await (await getOwnerJson()).body;
        owners = paperOwnersJson.ecOwner;
    } else {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                msg: '您尚未輸入手機號碼'
            })
        };
    }

    if (!checkTaiwanPhoneNumber(phoneNumber)) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                msg: '該號碼格式不正確，請重新輸入!'
            })
        };
    }

    if (owners.includes(phoneNumber)) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                msg: '該號碼已經領取過優惠!'
            })
        };
    }

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
            msg: '該號碼可以使用'
        })
    };
};

const checkTaiwanPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^09\d{8}$/;
    return phoneNumberRegex.test(phoneNumber);
};

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