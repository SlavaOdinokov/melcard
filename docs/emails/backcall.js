const keys =require('../keys')

module.exports = function(data) {
    return {
        to: keys.EMAIL_TO,
        from: keys.EMAIL_FROM,
        subject: `Заявка на обратный звонок с сайта ${keys.BASE_URL}`,
        html: `
            <h1>Заявка на обратный звонок от:</h1>
            <p>Имя: ${data.name}</p>
            <p>Телефон: ${data.phone}</p>
            <a href="${keys.BASE_URL}">Melcard</a>
        `
    }
}