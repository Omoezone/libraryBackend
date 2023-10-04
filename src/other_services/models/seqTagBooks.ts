import { DataTypes, Model, Sequelize } from 'sequelize';

class TagBook extends Model {
    declare tag_book_id: number;
    declare book_id: number;
    declare tag_id: number;
}

export default (sequelize: Sequelize) => {
    TagBook.init(
        {
        tag_book_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        },
        {
        sequelize,
        modelName: 'TagBook',
        tableName: 'tag_books',
        timestamps: false, 
        createdAt: false,
        }
    );
};
