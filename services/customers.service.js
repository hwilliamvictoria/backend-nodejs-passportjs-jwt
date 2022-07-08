const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt');

const { User } = require('../db/models/user.model');

class CustomerService {

  constructor() { }

  async find() {
    const rta = await models.Customer.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password']
        }
      }]
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound('customer not found');
    }
    return user;
  }

  async create(data) {
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash
      }
    };
    const newCustomer = await models.Customer.create(newData, {
      include: ['user']
    });

    delete newCustomer.user.dataValues.password;

    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }

}

module.exports = CustomerService;
