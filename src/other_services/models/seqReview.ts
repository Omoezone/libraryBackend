import { DataTypes, Model } from 'sequelize';
import sequelize from "../sequalizerConnection";
import { Book } from './seqBooks';

export class Review extends Model {
    declare review_id: number;
    declare stars: number;
    declare user_id: number;
    declare book_id: number;
}
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
            timestamps: false,
            createdAt: false,
        }
    );
