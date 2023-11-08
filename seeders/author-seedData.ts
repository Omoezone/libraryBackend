'use strict';
import sequelize from 'sequelize';
import { Sequelize } from 'sequelize';
import { QueryInterface } from 'sequelize/types';
/*
module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    const famousAuthors = [
      'J.K. Rowling',
      'George Orwell',
      'Stephen King',
      'J.R.R. Tolkien',
      'Agatha Christie',
      'Harper Lee',
      'William Shakespeare',
      'Ernest Hemingway',
      'Mark Twain',
      'F. Scott Fitzgerald',
      'Jane Austen',
      'Leo Tolstoy',
      'Charles Dickens',
      'H.G. Wells',
      'Virginia Woolf',
      'Oscar Wilde',
      'Herman Melville',
      'Emily Bronte',
      'Edgar Allan Poe',
      'John Steinbeck',
      'Arthur Conan Doyle',
      'Toni Morrison',
      'Gabriel Garcia Marquez',
      'Aldous Huxley',
      'Rudyard Kipling',
      'Franz Kafka',
      'Kurt Vonnegut',
      'George R.R. Martin',
      'Mary Shelley',
      'Homer', 
    ];

    const authors = famousAuthors.map((name, index) => ({
      username: name,
      total_books: Math.floor(Math.random() * 10) + 1, 
    }));

    await queryInterface.bulkInsert('authors', authors, {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.bulkDelete('authors', null, {});
  },
};
*/