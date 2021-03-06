const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const { config } = require('./../config/config');

const UserService = require('./user.service');
const service = new UserService();

class AuthService {

  constructor() { }

  async getUser(email, password) {
    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, config.jwtSecret);

    return {
      user,
      token
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });

    const mail = {
      from: config.mailUser, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para recuperar contraseña", // Subject line
      //text: "Hello world?", // plain text body
      html: `<b>Por favor ingresar a este link => ${link}</b>`, // html body
    };

    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: config.portMail,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.mailUser,
        pass: config.mailPass
      }
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

}

module.exports = AuthService;
