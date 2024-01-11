function textVerify(string){
    return /^[A-Za-z]+$/.test(string);
}

function numberVerify(string){
    return /^\d+$/.test(string)
}

function cepVerify(string){
    
    return /^\d+$/.test(string) && string.length==8
}

function contatoVerify(string){
    const regex = /^(?:\+\d{1,3})?[-\s]?\d{2,4}[-\s]?\d{5,7}$/;

  return regex.test(string);
}

function cpfVerify(string){
    cpf = string.replace(/[\D]/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = (remainder === 10 || remainder === 11) ? 0 : remainder;

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = (remainder === 10 || remainder === 11) ? 0 : remainder;

  // Verifica se os dígitos verificadores são válidos
  if (digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10))) {
    return true;
  } else {
    return false;
  }
}

console.log(cpfVerify("0"))