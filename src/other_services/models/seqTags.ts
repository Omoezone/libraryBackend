import { DataTypes, Model, Sequelize } from 'sequelize';

class Tag extends Model {
    declare tag_id: number;
    declare title: string;
    declare tag_description: string | null;
}

export default (sequelize: Sequelize) => {
    Tag.init(
        {
            tag_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            tag_description: {
                type: DataTypes.STRING(45),
                allowNull: true,
                defaultValue: 'Description missing',
            },
        },
        {
            sequelize,
            modelName: 'Tag',
            tableName: 'tags',
            timestamps: false, // No timestamps for this table
        }
    );
};
