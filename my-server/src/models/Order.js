const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Đảm bảo bạn đã cấu hình DB trong `src/config/db.js`

const Order = sequelize.define(
  "Order",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
