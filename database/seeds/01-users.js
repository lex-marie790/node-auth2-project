
exports.seed = function(knex) {
      return knex('users').insert([
        {username: 'billybob', password: 'password2', department: 'manager'}
      ]);
};

