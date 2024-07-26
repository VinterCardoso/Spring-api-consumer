export function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '')
  
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false
    }
  
    let sum = 0
    let dif
  
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }
    dif = (sum * 10) % 11
  
    if (dif === 10 || dif === 11) {
      dif = 0
    }
    if (dif !== parseInt(cpf.substring(9, 10))) {
      return false
    }
  
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }
    dif = (sum * 10) % 11
  
    if (dif === 10 || dif === 11) {
      dif = 0
    }
    if (dif !== parseInt(cpf.substring(10, 11))) {
      return false
    }
  
    return true
  }