import { DataTypes, Model} from "sequelize";
import sequelize from "../sequalizerConnection";

export class Book extends Model {
    declare book_id: number;
    declare title: string;
    declare picture: string | null;
    declare summary: string;
    declare pages: number;
    declare amount: number;
    declare available_amount: number;
    declare author_id: number;
}
    Book.init({
        book_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        picture: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        summary: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        pages: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        available_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, { 
        sequelize,
        modelName: 'Book',
        tableName: 'books',
        timestamps: false,
        createdAt: false,
    });

    console.log(Book === sequelize.models.Book); 

