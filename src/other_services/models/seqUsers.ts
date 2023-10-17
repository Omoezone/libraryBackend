import { DataTypes, Model } from 'sequelize';
import sequelize from "../sequalizerConnection";

export class User extends Model {
    declare user_id: number;
    declare created_at: string;
    declare is_deleted: boolean;
    declare deleted_at: string | null;
}
    User.init({
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, { 
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        createdAt: false,
    });

    console.log(User === sequelize.models.User); 

