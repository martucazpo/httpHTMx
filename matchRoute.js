

const matchRoute = (req, reqUrl, route) => {
    const pathParts = reqUrl.split('/');
    const routeParts = route.split('/');
    let params = {};

    for (let i = 0; i < pathParts.length; i++) {
        if (routeParts[i].match(/^:/)) {
            params[routeParts[i].replace(':', '')] = pathParts[i];
            Object.assign(req.params, params)
            return true
        }
    }
    return false
}

module.exports = matchRoute