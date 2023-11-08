'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    const usersData = [
      { name_id: 1, user_id: 1, email: 'john.doe@example.com', pass: 'password1', snap_timestamp: '2023-01-01' },
      { name_id: 2, user_id: 2, email: 'jane.smith@example.com', pass: 'password2', snap_timestamp: '2023-01-02' },
      { name_id: 3, user_id: 3, email: 'bob.johnson@example.com', pass: 'password3', snap_timestamp: '2023-01-03' },
      { name_id: 4, user_id: 4, email: 'alice.white@example.com', pass: 'password4', snap_timestamp: '2023-01-04' },
      { name_id: 5, user_id: 5, email: 'david.brown@example.com', pass: 'password5', snap_timestamp: '2023-01-05' },
      { name_id: 6, user_id: 6, email: 'susan.wilson@example.com', pass: 'password6', snap_timestamp: '2023-01-06' },
      { name_id: 7, user_id: 7, email: 'lisa.jones@example.com', pass: 'password7', snap_timestamp: '2023-01-07' },
      { name_id: 8, user_id: 8, email: 'michael.james@example.com', pass: 'password8', snap_timestamp: '2023-01-08' },
      { name_id: 9, user_id: 9, email: 'emily.davis@example.com', pass: 'password9', snap_timestamp: '2023-01-09' },
      { name_id: 10, user_id: 10, email: 'robert.martin@example.com', pass: 'password10', snap_timestamp: '2023-01-10' },
      { name_id: 11, user_id: 11, email: 'elizabeth.wilson@example.com', pass: 'password11', snap_timestamp: '2023-01-11' },
      { name_id: 12, user_id: 12, email: 'joseph.hall@example.com', pass: 'password12', snap_timestamp: '2023-01-12' },
      { name_id: 13, user_id: 13, email: 'margaret.jones@example.com', pass: 'password13', snap_timestamp: '2023-01-13' },
      { name_id: 14, user_id: 14, email: 'daniel.white@example.com', pass: 'password14', snap_timestamp: '2023-01-14' },
      { name_id: 15, user_id: 15, email: 'patricia.harris@example.com', pass: 'password15', snap_timestamp: '2023-01-15' },      
      { name_id: 16, user_id: 1, email: 'john.doe2@example.com', pass: 'password16', snap_timestamp: '2023-01-16' },
      { name_id: 17, user_id: 1, email: 'john.doe3@example.com', pass: 'password17', snap_timestamp: '2023-01-17' },
      { name_id: 18, user_id: 2, email: 'john.doe4@example.com', pass: 'password18', snap_timestamp: '2023-01-18' },
      { name_id: 19, user_id: 4, email: 'jane.smith2@example.com', pass: 'password19', snap_timestamp: '2023-01-19' },
      { name_id: 20, user_id: 3, email: 'jane.smith3@example.com', pass: 'password20', snap_timestamp: '2023-01-20' },
      
    ];

    await queryInterface.bulkInsert('users_data', usersData, {});

    return Promise.resolve();
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.bulkDelete('users_data', null, {});
  },
};
