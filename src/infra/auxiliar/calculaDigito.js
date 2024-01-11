function calcularDigitoVerificador(numero) {
    // Converte o número para uma string e inverte os dígitos
    const reversedDigits = numero.split('').reverse().map(Number);
  
    // Calcula o dígito verificador usando o algoritmo de módulo 10
    const soma = reversedDigits.reduce((acc, digit, index) => {
      if (index % 2 === 1) {
        const doubledDigit = digit * 2;
        return acc + (doubledDigit > 9 ? doubledDigit - 9 : doubledDigit);
      }
      return acc + digit;
    }, 0);
  
    const digitoVerificador = (10 - (soma % 10)) % 10;
    return digitoVerificador;
}

module.exports = {calcularDigitoVerificador}