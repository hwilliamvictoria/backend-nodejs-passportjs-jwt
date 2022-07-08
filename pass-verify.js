const bcrypt = require('bcrypt');

const verifyPassword = async () => {
  const myPassword = 'Willina04132019';
  const hash = '$2b$10$NTbh4Qh313S6diEjxOtn8eBXhdRI1AZT9/Zr2OP3lRbXBpf29xh.i';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();
