import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequalizerConnection';

export class UserName extends Model {
    declare name_id: number;
    declare first_name: string;
    declare last_name: string;
}
UserName.init(
  {
    name_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserName', // Model name
    tableName: 'user_names', // Table name
    timestamps: false, // Disable timestamps
    createdAt: false, // Disable createdAt column
  }
);
