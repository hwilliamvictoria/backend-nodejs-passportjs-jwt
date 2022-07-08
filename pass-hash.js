const bcrypt = require('bcrypt');

const hashPassword = async () => {
  const myPassword = 'Willina04132019';
  const hash = await bcrypt.hash(myPassword, 10);
  console.log(hash);
}

hashPassword();
