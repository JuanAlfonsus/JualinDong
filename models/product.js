'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User)
      Product.belongsToMany(models.Category, {
        through: "ProductCategories",
        // as: "Products",
        // foreignKey: "ProductId"
      })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama produk harus diisi!'
        },
        notEmpty: {
          msg: 'Nama produk harus diisi!'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Deskripsi produk harus diisi!'
        },
        notEmpty: {
          msg: 'Deskripsi produk harus diisi!'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Harga harus diisi!'
        },
        notEmpty: {
          msg: 'Harga harus diisi!'
        }
      }
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Foto produk harus diisi!'
        },
        notEmpty: {
          msg: 'Foto produk harus diisi!'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Stok barang harus diisi!'
        },
        notEmpty: {
          msg: 'Stok barang harus diisi!'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};