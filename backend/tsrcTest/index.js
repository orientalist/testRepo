const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event) => {

    const requestBody = JSON.parse(event.body);
    let surceyValue = '';
    surceyValue = requestBody.value;

    if (!surceyValue) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                msg: '您尚未輸入資料喔!'
            })
        };
    }

    if (surceyValue!=='cake') {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                msg: '通關密語錯誤!'
            })
        };
    }

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
            msg: '通關密語正確!'
        })
    };
};