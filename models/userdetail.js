'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }

    phoneNumberFormat() {
      if(this.phone[0]+this.phone[1] === '62') return this.phone
      if(this.phone[0]+this.phone[1] === '08') return '62' + this.phone.substring(1)
    }

    linkWaSeller() {
      return `https://wa.me/${this.phone}`
    }

    get phoneNumber() {
      return `+` + this.phone
    }

  }
  UserDetail.init({
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nomor telfon harus diisi!'
        },
        notEmpty: {
          msg: 'Nomor telfon harus diisi!'
        },
        validatePhoneNumber(value) {
          console.log(value[0])
          if (value[0]+value[1] != '62') {
            if (value[0]+value[1] != '08') {
              throw new Error('Format nomor telfon salah')
            }
          }
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Alamat harus diisi!'
        },
        notEmpty: {
          msg: 'Alamat harus diisi!'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Url image harus diisi!'
        },
        notEmpty: {
          msg: 'Url image harus diisi!'
        }
      }
    },
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserDetail',
  });

  UserDetail.addHook('beforeCreate', (detail, options) => {
    detail.phone = detail.phoneNumberFormat()
  })
  return UserDetail;
};