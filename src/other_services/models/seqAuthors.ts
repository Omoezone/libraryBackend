import { DataTypes, Model} from "sequelize";
import sequelize from "../sequalizerConnection";
export class Author extends Model {
    declare author_id: number;
    declare username: string;
    declare total_books: number;
}
    Author.init(
    {
        author_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        total_books: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        modelName: 'Author',
        tableName: 'authors',
        timestamps: false,
        createdAt: false,
    });

    console.log(Author == sequelize.models.Author ? "Author model made correctly" : "Cannot make author model");