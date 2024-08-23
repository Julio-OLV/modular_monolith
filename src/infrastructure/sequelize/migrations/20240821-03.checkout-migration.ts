import { DataTypes, Sequelize } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("checkouts", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "client_id",
      references: {
        model: "clients",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await sequelize.getQueryInterface().createTable("checkout_product", {
    checkoutId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "checkout_id",
      references: {
        model: "checkouts",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "product_id",
      references: {
        model: "products",
        key: "id",
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("checkout_product");
  await sequelize.getQueryInterface().dropTable("checkouts");
};
