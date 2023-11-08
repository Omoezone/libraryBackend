'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    const users = [
        { created_at: '2023-01-01', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-02', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-03', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-04', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-05', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-06', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-07', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-08', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-09', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-10', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-11', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-12', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-13', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-14', is_deleted: false, deleted_at: null },
        { created_at: '2023-01-15', is_deleted: false, deleted_at: null },
    ];

    const userRecords = await queryInterface.bulkInsert('users', users, {});

    return userRecords;
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
