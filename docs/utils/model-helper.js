const modelHelpers = (reqBody) => {
    reqBody.panelsParams = []

    if (reqBody.panels) {
        const panels = reqBody.panels
        panels.forEach(item => {
            let onePanelArray = item.split(', ')
            const onePanelObj = {
                namePanel: onePanelArray[0],
                pathPanel: onePanelArray[1],
                pricePanel: onePanelArray[2],
                classPanel: onePanelArray[3]
            }
            reqBody.panelsParams.push(onePanelObj)
        })
    }
}

module.exports = modelHelpers