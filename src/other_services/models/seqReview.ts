import { DataTypes, Model, Sequelize } from 'sequelize';

class Review extends Model {
    declare review_id: number;
    declare stars: number;
    declare user_id: number;
    declare book_id: number;
}

export default (sequelize: Sequelize) => {
    Review.init(
        {
            review_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            stars: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 3,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Review',
            tableName: 'reviews',
            timestamps: true,
        }
    );
};
