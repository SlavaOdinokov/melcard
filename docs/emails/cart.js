const keys =require('../keys')

const handlerArr = (arr) => {
    const newArr = JSON.parse(arr)
    let someArr = []
    let str = ''

    newArr.forEach(item => {
        const obj = `<p><span>${item.name}</span>
        <span> Цена: ${item.price}р.</span>
        <span> Кол-во: ${item.count}</span></p>`

        someArr.push(obj)
        str = someArr.join(' ')
    })

    return str
}

module.exports = function(data) {
    const strDoors = handlerArr(data.orderDoors)
    const strPanels = handlerArr(data.orderPanels)
    const strServices = handlerArr(data.orderServices)

    const html = `
        <h1>Заказ с сайта ${keys.BASE_URL}:</h1>
        <h3>Контактные данные:</h3>
        <p>Имя: ${data.name}</p>
        <p>Фамилия: ${data.lastname}</p>
        <p>Телефон: ${data.phone}</p>
        <p>Адресс: ${data.address}</p>
        <p>Дом: ${data.house}</p>
        <p>Подъезд: ${data.porch}</p>
        <p>Этаж: ${data.floor}</p>
        <p>Квартира: ${data.flat}</p>
        <p>Комментарий: ${data.comment}</p>
        <hr />
        <h3>Заказ:</h3>
        <p><strong>Дверь:</strong></p>${strDoors}
        <p><strong>Панель:</strong></p>${strPanels}
        <p><strong>Услуги:</strong></p>${strServices}
        <a href="${keys.BASE_URL}">Melcard</a>
    `

    return {
        to: keys.EMAIL_TO,
        from: keys.EMAIL_FROM,
        subject: `Заказ с сайта ${keys.BASE_URL}`,
        html: html
    }
}