function generateCVC(){
    const stringCVC = Math.floor( Math.random() * 900 +100 ).toString()
    return stringCVC
}

module.exports = {generateCVC}