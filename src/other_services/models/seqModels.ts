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
            validate: {
                min: 0,
                max : 100,
            },
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
            validate: {
                min: 0,
                // Come on, no one will write a book with more than 1000 pages
                max : 1000,
            },
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 0,
                max : 100,
            },
        },
        available_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 0,
                max : 100,
            },
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
            validate: {
                min: 1,
                max: 5,
                msg: 'Stars must be between 1 and 5',
            },
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
    }
);
export class UserData extends Model {
    declare user_data_id: number;
    declare name_id: number;
    declare user_id: number;
    declare email: string;
    declare pass: string;
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
            validate: {
                len: [8, 50],
            },
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
    }
);
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
            validate: {
                isAlpha: true,
                len: [2, 45],
            },
        },
        last_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                isAlpha: true,
                len: [2, 45],
            },
        },
    },
    {
        sequelize,
        modelName: 'UserName', 
        tableName: 'user_names', 
        timestamps: false, 
        createdAt: false, 
    }
);

export class BookInteraction extends Model {
    declare book_interaction_id: number;
    declare user_id: number;
    declare book_id: number;
    declare interaction_type: string;
}
BookInteraction.init(
    {
        book_interaction_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        interaction_type: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                isIn: [['Borrowed', 'Bookmarked', 'Has_Borrowed']],
            },
        },
    },
    {
        sequelize,
        modelName: 'BookInteraction',
        tableName: 'book_interactions',
        timestamps: false,
        createdAt: false,
    }
);

Book.belongsTo(Author, { foreignKey: 'author_id' });
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.hasMany(Review, { foreignKey: 'book_id' });
Review.belongsTo(Book, { foreignKey: 'book_id' });
Book.belongsToMany(Tag, { through: 'TagBook', foreignKey: 'book_id', otherKey: 'tag_id' });
User.hasOne(UserData, {foreignKey: 'user_id'});
UserData.belongsTo(User, {foreignKey: 'user_id'});
UserData.belongsTo(UserName, {foreignKey: 'name_id'});
UserName.hasMany(UserData, {foreignKey: 'name_id'});  
BookInteraction.belongsTo(User, {foreignKey: 'user_id'});
BookInteraction.belongsTo(Book, {foreignKey: 'book_id'});
User.hasMany(BookInteraction, {foreignKey: 'user_id'});
