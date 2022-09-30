function pipe(funcs) {
    let result
    return (x) => {
        if (result === undefined) result = x
        funcs.forEach((func) => {
            result = func(result)
        })
        return result
    }
}

module.exports = pipe