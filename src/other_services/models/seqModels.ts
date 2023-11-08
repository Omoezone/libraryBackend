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
            type: DataTypes.STRING(800),
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
    }
);

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

export class Tag extends Model {
    declare tag_id: number;
    declare title: string;
    declare tag_description: string | null;
}
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
            timestamps: false, 
            createdAt: false,
        }
    );

export class TagBook extends Model {
    declare tag_book_id: number;
    declare book_id: number;
    declare tag_id: number;
}
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

Book.belongsTo(Author, { foreignKey: 'author_id' });
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.hasMany(Review, { foreignKey: 'book_id' });
Review.belongsTo(Book, { foreignKey: 'book_id' });
Book.belongsToMany(Tag, { through: 'TagBook', foreignKey: 'book_id', otherKey: 'tag_id' });