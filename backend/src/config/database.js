const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: String(process.env.DB_LOGGING).toLowerCase() === "true" ? console.log : false,
    timezone: "+07:00",
    define: {
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    },
  }
);

module.exports = sequelize;
