module.exports = (sequelize, Sequelize) => {
  const Incident = sequelize.define(
    "incident",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM("Low", "Medium", "High"),
        allowNull: false,
      },
      reported_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      // Additional indexes for faster queries
      indexes: [
        {
          name: "idx_incidents_severity",
          fields: ["severity"],
        },
        {
          name: "idx_incidents_reported_at",
          fields: ["reported_at"],
        },
      ],
    }
  );

  return Incident;
};
