type Index = 0 | 1 | 2;

export interface LessonStep {
  title: string;
  body: string;
  code: string;
  from: Index;
  to: Index;
}

export interface CourseLesson {
  group: string;
  title: string;
  intro: string;
  nodes: [string, string, string];
  steps: LessonStep[];
  question: string;
  answers: [string, string, string];
  correct: Index;
  why: string;
}

const course: CourseLesson[] = [
  {
    "group": "Request fundamentals",
    "title": "The request lifecycle",
    "intro": "Follow a book lookup from your browser to the database and back.",
    "nodes": [
      "Browser",
      "API server",
      "Database"
    ],
    "steps": [
      {
        "title": "Send a request",
        "body": "You open the page for book 42. The browser asks the API for that book. GET describes the operation and the path identifies the resource.",
        "code": "GET /books/42",
        "from": 0,
        "to": 1
      },
      {
        "title": "Look up the book",
        "body": "The server matches the route, reads the book ID and passes it to a parameterized database query.",
        "code": "SELECT title FROM books WHERE id = $1",
        "from": 1,
        "to": 2
      },
      {
        "title": "Read the result",
        "body": "The database finds a matching row and returns its title. An empty result would let the handler take a different path.",
        "code": "row = { title: 'Night Train' }",
        "from": 2,
        "to": 1
      },
      {
        "title": "Return a response",
        "body": "The handler sends JSON with a 200 status. The browser reads the title and can now display the book.",
        "code": "200 OK  ·  {\"title\":\"Night Train\"}",
        "from": 1,
        "to": 0
      }
    ],
    "question": "The query succeeds but finds no book. Which status fits this lookup?",
    "answers": [
      "201 Created",
      "404 Not Found",
      "500 Internal Server Error"
    ],
    "correct": 1,
    "why": "The request is valid, but the requested book does not exist."
  },
  {
    "group": "Request fundamentals",
    "title": "Routes and handlers",
    "intro": "See how one URL selects a particular piece of server code.",
    "nodes": [
      "Client",
      "Router",
      "Handler"
    ],
    "steps": [
      {
        "title": "Choose a route",
        "body": "The client asks for a specific shelf. The router sees both the HTTP method and the request path.",
        "code": "GET /shelves/7",
        "from": 0,
        "to": 1
      },
      {
        "title": "Match the pattern",
        "body": "A parameter in the route pattern captures the final segment. The router passes its value to the selected handler.",
        "code": "GET /shelves/:id   id = '7'",
        "from": 1,
        "to": 2
      },
      {
        "title": "Build the result",
        "body": "The handler uses the captured ID to load the shelf and prepares a response with its public fields.",
        "code": "{ id: 7, name: 'Fiction' }",
        "from": 2,
        "to": 1
      },
      {
        "title": "Finish the exchange",
        "body": "The server returns the result. A request to a different method on the same path can select a different handler.",
        "code": "200 OK",
        "from": 1,
        "to": 0
      }
    ],
    "question": "What normally selects a route?",
    "answers": [
      "Method and path",
      "Response size",
      "Database row count"
    ],
    "correct": 0,
    "why": "The same path can support distinct operations such as GET and DELETE."
  },
  {
    "group": "Request fundamentals",
    "title": "Middleware",
    "intro": "Follow a private request through a session check before it reaches a handler.",
    "nodes": [
      "Browser",
      "Session check",
      "Handler"
    ],
    "steps": [
      {
        "title": "Present a session",
        "body": "The browser includes its session cookie when requesting the reading list.",
        "code": "GET /reading-list",
        "from": 0,
        "to": 1
      },
      {
        "title": "Continue the chain",
        "body": "Middleware validates the session and attaches the user identity before handing control to the route.",
        "code": "request.user.id = 12",
        "from": 1,
        "to": 2
      },
      {
        "title": "Scope the lookup",
        "body": "The handler loads only entries belonging to this user and returns them through the middleware chain.",
        "code": "listEntries({ owner: 12 })",
        "from": 2,
        "to": 1
      },
      {
        "title": "Handle an expired session",
        "body": "On a later request an expired session fails the check. Middleware can send the error before the handler runs.",
        "code": "401 Unauthorized",
        "from": 1,
        "to": 0
      }
    ],
    "question": "What happens if the session check ends the request?",
    "answers": [
      "Every handler still runs",
      "The database retries",
      "The protected handler is skipped"
    ],
    "correct": 2,
    "why": "Middleware can send a response directly or pass control onward."
  },
  {
    "group": "API design",
    "title": "Creating resources",
    "intro": "Create a reading list and learn how the API identifies it afterward.",
    "nodes": [
      "Client",
      "Lists API",
      "Database"
    ],
    "steps": [
      {
        "title": "Submit the list",
        "body": "The client posts a representation to the collection. The server is responsible for assigning the new list an ID.",
        "code": "POST /lists   {\"name\":\"Weekend\"}",
        "from": 0,
        "to": 1
      },
      {
        "title": "Insert a row",
        "body": "After validation, the handler stores the name and requests the generated identifier.",
        "code": "INSERT INTO lists(name) VALUES ($1) RETURNING id",
        "from": 1,
        "to": 2
      },
      {
        "title": "Receive the ID",
        "body": "The database confirms the new row. The handler now knows which URL identifies the list.",
        "code": "id = 53",
        "from": 2,
        "to": 1
      },
      {
        "title": "Identify the resource",
        "body": "A 201 response reports creation and the Location header gives the client a direct link to the new list.",
        "code": "201 Created   Location: /lists/53",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Where can the server indicate the URL of a newly created resource?",
    "answers": [
      "Accept header",
      "Location header",
      "Cookie expiry"
    ],
    "correct": 1,
    "why": "Location can identify the created resource in a 201 response."
  },
  {
    "group": "API design",
    "title": "Input validation",
    "intro": "Catch a bad quantity before it reaches the order-writing code.",
    "nodes": [
      "Client",
      "Validator",
      "Order handler"
    ],
    "steps": [
      {
        "title": "Read the input",
        "body": "A client asks for two books. The API parses the JSON body and checks that quantity is present.",
        "code": "{ \"quantity\": 2 }",
        "from": 0,
        "to": 1
      },
      {
        "title": "Check the contract",
        "body": "The value must be an integer from 1 to 10. A valid quantity can proceed to the order handler.",
        "code": "integer(quantity) && quantity >= 1 && quantity <= 10",
        "from": 1,
        "to": 2
      },
      {
        "title": "Report a bad value",
        "body": "Another request supplies zero. The validator returns a field-specific error so the client can explain what to change.",
        "code": "422   {\"field\":\"quantity\",\"min\":1}",
        "from": 1,
        "to": 0
      },
      {
        "title": "Correct the request",
        "body": "The client resubmits with a valid quantity. The handler must still check business rules such as available stock.",
        "code": "{ \"quantity\": 1 }",
        "from": 0,
        "to": 1
      }
    ],
    "question": "Which check still belongs in order processing after quantity passes validation?",
    "answers": [
      "Whether the JSON is parseable",
      "Whether quantity is an integer",
      "Whether enough stock is available"
    ],
    "correct": 2,
    "why": "Input shape can be valid even when current inventory cannot satisfy an order."
  },
  {
    "group": "API design",
    "title": "Cursor pagination",
    "intro": "Page through a growing book catalogue without counting past earlier rows.",
    "nodes": [
      "Reader",
      "Books API",
      "Database"
    ],
    "steps": [
      {
        "title": "Ask for a page",
        "body": "The reader requests two books. The API sorts by a unique, stable ID so that the page boundary is unambiguous.",
        "code": "GET /books?limit=2",
        "from": 0,
        "to": 1
      },
      {
        "title": "Look one row ahead",
        "body": "The API requests three rows. The extra row tells it whether there is another page.",
        "code": "SELECT id FROM books ORDER BY id LIMIT 3",
        "from": 1,
        "to": 2
      },
      {
        "title": "Return the boundary",
        "body": "The first two IDs are 17 and 22. The API returns them with a cursor representing 22, the last item it delivered.",
        "code": "items: [17, 22], next: 'after22'",
        "from": 1,
        "to": 0
      },
      {
        "title": "Resume after the cursor",
        "body": "For the next page the API decodes the cursor and starts strictly after 22. Gaps between IDs do not matter.",
        "code": "SELECT id FROM books WHERE id > $1 ORDER BY id LIMIT 3",
        "from": 1,
        "to": 2
      }
    ],
    "question": "Which row should this cursor identify?",
    "answers": [
      "The last item delivered",
      "The extra lookahead item",
      "The first item in the database"
    ],
    "correct": 0,
    "why": "Starting after the last delivered item includes the lookahead item on the next page."
  },
  {
    "group": "Databases",
    "title": "Relationships and joins",
    "intro": "Connect a loan to its book without copying the title into every loan.",
    "nodes": [
      "Loans API",
      "Loans table",
      "Books table"
    ],
    "steps": [
      {
        "title": "Find a loan",
        "body": "A request for loan 15 needs its due date and the title of the borrowed book.",
        "code": "loan.id = 15",
        "from": 0,
        "to": 1
      },
      {
        "title": "Follow the key",
        "body": "The loan stores book_id. A foreign key can require that this value refers to an existing book.",
        "code": "loans.book_id = books.id",
        "from": 1,
        "to": 2
      },
      {
        "title": "Join the rows",
        "body": "The query matches the loan to its book and selects just the fields the reader needs.",
        "code": "SELECT b.title, l.due FROM loans l JOIN books b ON b.id = l.book_id WHERE l.id = $1",
        "from": 2,
        "to": 0
      },
      {
        "title": "Read a later edit",
        "body": "If the catalogue title changes, the next join reads the updated title. The stored loan still refers to the same book.",
        "code": "book_id = 42",
        "from": 0,
        "to": 1
      }
    ],
    "question": "Which field links a loan to a specific book?",
    "answers": [
      "The due date",
      "The title length",
      "The book foreign key"
    ],
    "correct": 2,
    "why": "The foreign key stores the identity of the related book."
  },
  {
    "group": "Databases",
    "title": "Database indexes",
    "intro": "See why an index helps find one library card among thousands.",
    "nodes": [
      "Query",
      "B-tree index",
      "Table"
    ],
    "steps": [
      {
        "title": "Filter by card",
        "body": "The query asks for the member whose card number is 8042. A scan could check each row.",
        "code": "SELECT name FROM members WHERE card = $1",
        "from": 0,
        "to": 2
      },
      {
        "title": "Use the index",
        "body": "An index on card maintains ordered keys. The planner may choose it when few rows will match.",
        "code": "CREATE INDEX members_card ON members(card)",
        "from": 0,
        "to": 1
      },
      {
        "title": "Fetch the row",
        "body": "The index points to a candidate row. The database reads it to check visibility and retrieve the member name.",
        "code": "card 8042  →  row location",
        "from": 1,
        "to": 2
      },
      {
        "title": "Account for writes",
        "body": "When the card number changes, the database must maintain the corresponding index entries. Faster lookups carry a write cost.",
        "code": "UPDATE members SET card = $1 WHERE id = $2",
        "from": 2,
        "to": 1
      }
    ],
    "question": "Why can adding an index slow down updates?",
    "answers": [
      "Every index deletes the table",
      "Affected index entries need maintenance",
      "Indexes disable transactions"
    ],
    "correct": 1,
    "why": "A change to indexed data can require extra writes to keep the index accurate."
  },
  {
    "group": "Databases",
    "title": "Transactions",
    "intro": "Reserve the last copy and create its loan as one database operation.",
    "nodes": [
      "Reader",
      "Loan service",
      "Database"
    ],
    "steps": [
      {
        "title": "Request a loan",
        "body": "Two readers may request the same copy. A check in the browser cannot establish who acquired it.",
        "code": "POST /loans   {\"copy\":9}",
        "from": 0,
        "to": 1
      },
      {
        "title": "Reserve conditionally",
        "body": "Inside a transaction, change the copy only if it is available. Check that exactly one row changed before continuing.",
        "code": "UPDATE copies SET free = false WHERE id = $1 AND free = true",
        "from": 1,
        "to": 2
      },
      {
        "title": "Record the loan",
        "body": "Use the same transaction to insert the loan. If the insert fails, roll back so the copy remains available.",
        "code": "INSERT INTO loans(copy_id, user_id) VALUES ($1, $2)",
        "from": 1,
        "to": 2
      },
      {
        "title": "Confirm the commit",
        "body": "The service reports success after commit. Other readers then see the reservation and the matching loan together.",
        "code": "COMMIT",
        "from": 2,
        "to": 1
      }
    ],
    "question": "The loan insert fails after the reservation update. What restores consistency?",
    "answers": [
      "Retrying only the browser request",
      "Sending a success response",
      "Rolling back the transaction"
    ],
    "correct": 2,
    "why": "Rollback removes the uncommitted reservation along with any other changes in the transaction."
  },
  {
    "group": "Identity and access",
    "title": "Session cookies",
    "intro": "Keep a reader signed in across independent HTTP requests.",
    "nodes": [
      "Browser",
      "API server",
      "Session store"
    ],
    "steps": [
      {
        "title": "Verify sign-in",
        "body": "The reader signs in over HTTPS. After verifying their credentials the server generates a fresh, unpredictable session identifier.",
        "code": "POST /sessions",
        "from": 0,
        "to": 1
      },
      {
        "title": "Store the session",
        "body": "The server associates the identifier with the reader and an expiry time in server-side storage.",
        "code": "session → { user: 12, expiresAt }",
        "from": 1,
        "to": 2
      },
      {
        "title": "Issue the cookie",
        "body": "The server sends the identifier in a cookie. HttpOnly keeps it out of page scripts and Secure restricts transmission to secure connections.",
        "code": "Set-Cookie: sid=…; Secure; HttpOnly; SameSite=Lax",
        "from": 1,
        "to": 0
      },
      {
        "title": "Recognize the reader",
        "body": "A later request includes the cookie. The server looks up the session and checks its expiry before using the stored identity.",
        "code": "lookup(sid)",
        "from": 1,
        "to": 2
      }
    ],
    "question": "How can this server end a session immediately?",
    "answers": [
      "Delete its entry from the session store",
      "Rename the reader",
      "Change the page title"
    ],
    "correct": 0,
    "why": "Once the server rejects that identifier, the old cookie can no longer establish a session."
  },
  {
    "group": "Identity and access",
    "title": "Resource permissions",
    "intro": "Decide who may edit a shared reading list.",
    "nodes": [
      "Reader",
      "Lists API",
      "Permissions"
    ],
    "steps": [
      {
        "title": "Ask to edit",
        "body": "A signed-in reader submits a new list name. The session establishes the reader’s identity.",
        "code": "PATCH /lists/53",
        "from": 0,
        "to": 1
      },
      {
        "title": "Check the resource",
        "body": "The API checks this reader’s role on list 53. Permission on another list would not answer this question.",
        "code": "roleFor(userId, listId)",
        "from": 1,
        "to": 2
      },
      {
        "title": "Evaluate the role",
        "body": "The permission record says viewer. The API allows viewers to read while reserving renaming for editors and owners.",
        "code": "role = 'viewer'",
        "from": 2,
        "to": 1
      },
      {
        "title": "Return the decision",
        "body": "The API rejects the edit before changing the list. Hiding the rename button in the interface alone would leave the route unprotected.",
        "code": "403 Forbidden",
        "from": 1,
        "to": 0
      }
    ],
    "question": "What information does an edit permission check need?",
    "answers": [
      "Only the browser type",
      "The user, resource and requested action",
      "Only the list name"
    ],
    "correct": 1,
    "why": "Access depends on who is acting, which list is affected and what they want to do."
  },
  {
    "group": "Identity and access",
    "title": "Password verification",
    "intro": "Verify a sign-in while storing a password verifier in the database.",
    "nodes": [
      "Browser",
      "Auth service",
      "Users table"
    ],
    "steps": [
      {
        "title": "Create the account",
        "body": "The reader sends a new password over HTTPS. The service keeps the password out of application logs.",
        "code": "POST /accounts",
        "from": 0,
        "to": 1
      },
      {
        "title": "Store a verifier",
        "body": "A password-hashing library uses a fresh salt and a deliberately costly algorithm such as Argon2id. Its encoded verifier includes the parameters needed later.",
        "code": "store(email, encodedVerifier)",
        "from": 1,
        "to": 2
      },
      {
        "title": "Read the verifier",
        "body": "On a later sign-in the service fetches the saved verifier by account identifier.",
        "code": "SELECT verifier FROM users WHERE email = $1",
        "from": 2,
        "to": 1
      },
      {
        "title": "Check the candidate",
        "body": "The library verifies the submitted password using the stored parameters and salt. A successful check lets the service issue a session.",
        "code": "verify(encodedVerifier, candidate)",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Why use a different salt for each account?",
    "answers": [
      "To make the password shorter",
      "To recover the password later",
      "To make equal passwords produce different stored verifiers"
    ],
    "correct": 2,
    "why": "A fresh salt separates accounts even when two readers choose the same password."
  },
  {
    "group": "Background work",
    "title": "Work queues",
    "intro": "Move a slow catalogue export out of the request that starts it.",
    "nodes": [
      "Export API",
      "Job queue",
      "Worker"
    ],
    "steps": [
      {
        "title": "Enqueue the job",
        "body": "The API gives an export a stable ID and publishes its parameters. It can return a job handle after the queue confirms acceptance.",
        "code": "publish({ job: 84, format: 'csv' })",
        "from": 0,
        "to": 1
      },
      {
        "title": "Deliver the work",
        "body": "A worker receives the message. The queue tracks it as unacknowledged while the file is being built.",
        "code": "deliver(job84)",
        "from": 1,
        "to": 2
      },
      {
        "title": "Finish before acknowledging",
        "body": "The worker stores the file under the job ID, records completion and then acknowledges delivery.",
        "code": "ack(deliveryTag)",
        "from": 2,
        "to": 1
      },
      {
        "title": "Handle redelivery",
        "body": "If the worker disconnects before acknowledgement, the queue can deliver the job again. Checking completed job IDs avoids repeating a finished export.",
        "code": "if completed(84): acknowledge",
        "from": 1,
        "to": 2
      }
    ],
    "question": "When should this worker acknowledge the job?",
    "answers": [
      "As soon as it sees the message",
      "After saving the result and recording completion",
      "Before starting the export"
    ],
    "correct": 1,
    "why": "Acknowledging after completion preserves the chance to redeliver work interrupted by a crash."
  },
  {
    "group": "Background work",
    "title": "Cache-aside reads",
    "intro": "Serve a popular book from memory while keeping the database authoritative.",
    "nodes": [
      "Books API",
      "Cache",
      "Database"
    ],
    "steps": [
      {
        "title": "Check the cache",
        "body": "A request for book 42 first looks up its cache key. On the first visit the cache has no value.",
        "code": "GET book:42",
        "from": 0,
        "to": 1
      },
      {
        "title": "Read on a miss",
        "body": "The API goes to the database for the current book data. This path costs the database read plus the cache lookup.",
        "code": "SELECT title FROM books WHERE id = $1",
        "from": 0,
        "to": 2
      },
      {
        "title": "Fill the cache",
        "body": "The API stores a copy with a 60-second expiry. A write path can also invalidate the key when a title changes.",
        "code": "SET book:42 value EX 60",
        "from": 0,
        "to": 1
      },
      {
        "title": "Serve a hit",
        "body": "Another reader arrives before expiry. The cache supplies the value, saving a database lookup. An intervening update can make the copy stale.",
        "code": "hit → 'Night Train'",
        "from": 1,
        "to": 0
      }
    ],
    "question": "What can a reader see if a title changes before the cached copy expires?",
    "answers": [
      "The previous title",
      "Two database tables",
      "An automatic rollback"
    ],
    "correct": 0,
    "why": "The cached copy can remain stale until the application updates or invalidates it, or it expires."
  },
  {
    "group": "Background work",
    "title": "Safe retries",
    "intro": "Retry a timed-out checkout while keeping a single order.",
    "nodes": [
      "Client",
      "Orders API",
      "Order store"
    ],
    "steps": [
      {
        "title": "Identify the attempt",
        "body": "The client creates a unique key for this checkout and keeps it for retries of the same operation.",
        "code": "Idempotency-Key: checkout-84",
        "from": 0,
        "to": 1
      },
      {
        "title": "Write atomically",
        "body": "The API stores the order and the key together in a transaction. A unique constraint on the account and key coordinates concurrent attempts.",
        "code": "UNIQUE (account_id, request_key)",
        "from": 1,
        "to": 2
      },
      {
        "title": "Retry after timeout",
        "body": "The first response is lost. The client sends the same request and key. A timeout alone does not reveal whether the first write committed.",
        "code": "POST /orders   key=checkout-84",
        "from": 0,
        "to": 1
      },
      {
        "title": "Reuse the outcome",
        "body": "The API checks the stored request fingerprint. For a matching payload it returns the recorded order. A different payload using the key is rejected.",
        "code": "orderId = 918",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Which key should a retry of the same checkout use?",
    "answers": [
      "A fresh key each time",
      "The account password",
      "The original checkout key"
    ],
    "correct": 2,
    "why": "Reusing the key lets the service recognize a repeated operation and return its existing result."
  },
  {
    "group": "Operating services",
    "title": "Integration tests",
    "intro": "Test an API endpoint against a real disposable database.",
    "nodes": [
      "Test runner",
      "Lists API",
      "Test database"
    ],
    "steps": [
      {
        "title": "Arrange the data",
        "body": "Create an isolated test database state containing list 53. Known fixtures make failures easier to reproduce.",
        "code": "seedList({ id: 53, name: 'Weekend' })",
        "from": 0,
        "to": 2
      },
      {
        "title": "Exercise the route",
        "body": "The test sends an HTTP request through the same route used by the application.",
        "code": "GET /lists/53",
        "from": 0,
        "to": 1
      },
      {
        "title": "Run the real query",
        "body": "The handler calls the test database. This exercises the route, query and schema together.",
        "code": "SELECT name FROM lists WHERE id = $1",
        "from": 1,
        "to": 2
      },
      {
        "title": "Check the contract",
        "body": "The test verifies the status code and response fields, then clears the fixture so the next run starts from a known state.",
        "code": "expect(body.name).toEqual('Weekend')",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Which failure can this test catch that a mocked database may miss?",
    "answers": [
      "A reader losing Wi-Fi",
      "A query using the wrong column name",
      "A production disk running out of space"
    ],
    "correct": 1,
    "why": "Running the real query against the schema exposes mismatches between the application and database."
  },
  {
    "group": "Operating services",
    "title": "Distributed tracing",
    "intro": "Find the slow operation behind a single catalogue request.",
    "nodes": [
      "Gateway",
      "Books API",
      "Database"
    ],
    "steps": [
      {
        "title": "Start a trace",
        "body": "The gateway records a timed operation called a span and propagates a trace identifier when calling the books service.",
        "code": "trace = a7; span = gateway",
        "from": 0,
        "to": 1
      },
      {
        "title": "Time the query",
        "body": "The books service instruments its database call as a child span. All spans for this request share a trace ID.",
        "code": "span = query; parent = books",
        "from": 1,
        "to": 2
      },
      {
        "title": "Read the durations",
        "body": "The database call takes 180 ms inside a 205 ms API span. The child duration already contributes to the parent duration.",
        "code": "query: 180 ms   books: 205 ms",
        "from": 2,
        "to": 1
      },
      {
        "title": "Locate the delay",
        "body": "The gateway span lasts 220 ms. The database call accounts for most of this particular request, giving you a specific query to investigate.",
        "code": "gateway: 220 ms",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Should you add a nested query span to its parent to calculate request time?",
    "answers": [
      "No, the parent already includes the wait",
      "Yes, every span is separate",
      "Only for successful requests"
    ],
    "correct": 0,
    "why": "Nested spans can overlap in time. The outer span measures the overall elapsed interval."
  },
  {
    "group": "Operating services",
    "title": "Rolling deployments",
    "intro": "Release a new service version while continuing to serve readers.",
    "nodes": [
      "Router",
      "Old version",
      "New version"
    ],
    "steps": [
      {
        "title": "Serve existing traffic",
        "body": "Healthy instances of the current version handle requests while the deployment starts another instance.",
        "code": "route → v1",
        "from": 0,
        "to": 1
      },
      {
        "title": "Check readiness",
        "body": "The new process starts and exposes its readiness check. In this example it only reports ready after loading its required configuration.",
        "code": "GET /ready",
        "from": 0,
        "to": 2
      },
      {
        "title": "Admit new traffic",
        "body": "Once the instance is ready, the router can include it among healthy destinations. Old and new code may run at the same time.",
        "code": "healthy = [v1, v2]",
        "from": 0,
        "to": 2
      },
      {
        "title": "Drain the old version",
        "body": "The old instance stops receiving new requests and finishes work already in progress before shutdown. Shared schemas must support both versions during the rollout.",
        "code": "inFlight(v1) = 0",
        "from": 1,
        "to": 0
      }
    ],
    "question": "Why must a database change support both versions during this rollout?",
    "answers": [
      "Rolling deployments remove all old code first",
      "Readiness probes migrate the schema",
      "Both versions can receive traffic at the same time"
    ],
    "correct": 2,
    "why": "Overlapping versions read and write the same data until the old instances have drained."
  }
];


export default course;
