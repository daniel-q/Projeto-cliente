function generateVencimento(){
    const date = new Date();
    const year = date.getFullYear()+5;
    const month = date.getMonth() +1;
    const day = '1';
    return [year, month, day].join('-');
}

console.log(generateVencimento())

module.exports = {generateVencimento}