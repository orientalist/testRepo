const stripe=require('stripe')('sk_test_51MRtVoEgqibyWu69hZd4wQV1sUPyOQ8v6C83hQItUK13HE0P9idPHDxilkvGoAOtNR2iirMH9HpApgHVSf5m85wG00X8BbGtOL');

const main=async ()=>{
    const session=await stripe.checkout.sessions.create({
        line_items:[
            {
                price:'price_1MRuS2EgqibyWu69JHhlKt8l',
                quantity:2
            }
        ],
        mode:'payment',
        success_url:'https://zh.wikipedia.org/wiki/Wikipedia',
        cancel_url:'https://zh.wikipedia.org/wiki/%E9%95%BF%E9%B3%8D%E9%87%91%E6%9E%AA%E9%B1%BC'
    });
}