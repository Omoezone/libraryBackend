CREATE (Admin:User {
  user_id: toString(timestamp() * 10000 + rand() * 10000),
  created_at: timestamp(),
  is_deleted: false,
  deleted_at: null
})-[:HAS_USER_DATA]->(u:UserData {
  email: 'admin@example.com',
  password: 'adminPass',
  first_name: 'adminFirst',
  last_name: 'adminLast',
  role: "admin",
  snap_timestamp: timestamp()
})

CREATE (Audit:User {
  user_id: toString(timestamp() * 10000 + rand() * 10000),
  created_at: timestamp(),
  is_deleted: false,
  deleted_at: null
})-[:HAS_USER_DATA]->(ud:UserData {
  email: 'audit@example.com',
  password: 'auditPass',
  first_name: 'auditFirst',
  last_name: 'auditLast',
  role: "audit",
  snap_timestamp: timestamp()
})
