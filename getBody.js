

const getBody = (req, data) => {
    let dataStr = ""
    let body = {};
    dataStr += data
    let keyValue = dataStr.split("=")
    console.log("KV ", keyValue)
    let value = keyValue[1].replace(/(%20)/g," ")
    body[keyValue[0]] = value
    return req.body = body
}

module.exports = getBody


//.replace(':', '')]