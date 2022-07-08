const jwt = require('jsonwebtoken');

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY1NzIzMDkzN30.0A1yZHorMKpxnBWQBtQnEskBwe-Kuzy8fFv_qHHM67w';

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);

console.log(payload);
