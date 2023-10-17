import { DataTypes, Model } from 'sequelize';
import sequelize from "../sequalizerConnection";

export class UserData extends Model {
    declare user_data_id: number;
    declare name_id: number;
    declare user_id: number;
    declare email: string;
    declare password: string;
    declare snap_timestamp: string;
}
    UserData.init({
        users_data_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        pass: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        snap_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, { 
        sequelize,
        modelName: 'UserData',
        tableName: 'users_data',
        timestamps: false,
        createdAt: false,
    });

    console.log(UserData === sequelize.models.UserData);