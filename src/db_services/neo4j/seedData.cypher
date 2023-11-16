//Seed Data with multi reviews and tags
UNWIND range(1, 10) AS x  
CREATE (u:User {
  user_id: toString(timestamp() * 10000 + rand() * 10000),
  created_at: timestamp(),
  is_deleted: false,
  deleted_at: null
})-[:HAS_USER_DATA]->(ud:UserData {
  email: 'user' + toString(x) + '@example.com',
  pass: 'password' + toString(x),
  first_name: "FirstName" + toString(x),
  last_name: "LastName" + toString(x),
  snap_timestamp: timestamp()
})

// Books with connections to users
WITH u, ud
UNWIND range(1, toInteger(rand() * 8) + 2) AS bookIndex
WITH u, ud, toInteger(rand() * 15) + 1 AS x
CREATE (b:Book {
  book_id: toString(timestamp() * 10000 + rand() * 10000),  
  title: 'Book' + toString(x),
  picture: 'book' + toString(x) + '.jpg',
  summary: 'Summary' + toString(x),
  pages: 100 + x,
  amount: 4,
  available_amount: 3
})
CREATE (a:Author {
  author_id: toString(timestamp() * 10000 + rand() * 10000),
  username: "Author" + toString(x),
  total_books: 1  // Assuming each user has written one book
})

MERGE (b)-[:HAS_AUTHOR]->(a)
MERGE (u)-[:READ]->(b)

// Create between 1 and 4 tags for each book
WITH u, ud, b, x, a
UNWIND range(1, toInteger(rand() * 4) + 1) AS tagIndex
CREATE (t:Tag {
  title: "Tag" + toString(x) + "-" + toString(tagIndex),
  tag_description: "Tag" + toString(x) + " Description"
})
MERGE (b)-[:HAS_TAG]->(t)

CREATE (r:Review {
  stars: toInteger(rand() * 5) + 1
})
MERGE (b)-[:HAS_REVIEW]->(r)

RETURN u, ud, b, r, t, a;
