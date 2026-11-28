export const lessonGuides = [
  [
    "When you open a book page, the browser needs a title to show you. It sends a request, a message asking for information. The server looks up the book and sends a response. The number in that response tells the browser how the lookup went.",
    "Add a second book with ID 99. Run with 99, then 100. Only the missing book should return 404."
  ],
  [
    "A route pairs an action and an address, such as GET /books. A handler is the piece of code that answers that request. A book list and a health check can live on the same server because their addresses lead to different handlers.",
    "Add a /help entry to the routes object. Use /help as the input and check that your new message appears."
  ],
  [
    "Several handlers may need to know which messages belong to the same request. Middleware is code that runs along the way. Here it adds a tracking label to the request before handing it to the next piece of code.",
    "Add a second header named language with the value en. Run and find both labels in the returned request."
  ],
  [
    "Submitting a new book asks the server to create a record. The server checks the title, saves the book, and returns its new ID. A status of 201 means a new record was created.",
    "Add a pages field to the returned book. Run with a title, then with spaces only. Which result includes pages?"
  ],
  [
    "People can type almost anything into a form. Validation checks that the value makes sense before the server uses it. For an order, a quantity must be a whole number greater than zero.",
    "Add a maximum of 10 to the quantity check. Try 10, 11, and 2.5. Only 10 should pass."
  ],
  [
    "Imagine placing a bookmark after the last book you saw. A cursor plays that role for a list. The next request gives the server that bookmark so it can return the next few items in order.",
    "Change the page size from 2 to 3. With cursor 2, the next page should contain 4, 7, and 8."
  ],
  [
    "A book can store an author ID instead of repeating the author's name. A join matches that ID to an author record. The result can show the book title and author name together.",
    "Add a second book by author 2. Look up author 2 and check that both titles appear beside Mira."
  ],
  [
    "An index is like a directory at the back of a book. The database looks for a key in the directory, then uses its location to read the record. Here a map stands in for that directory.",
    "Add key b20 with row offset 15. Look up b20, then an unknown key. Compare the returned locations."
  ],
  [
    "A transfer has two linked changes. One balance falls and the other rises. A transaction makes those changes one unit so a failure cannot leave just one side recorded. The example calculates the pair in memory.",
    "Start with balances of 60 and 40. Transfer 25 and check that the total is still 100. Try 61 and check both balances."
  ],
  [
    "After sign-in, the browser can carry a small cookie containing a session ID. On the next request the server looks up that ID to remember the signed-in user. Here a map represents those saved sessions.",
    "Add a session named demo-two for Mira. Compare that input with an unknown session ID."
  ],
  [
    "Signing in identifies a person. The server still has to decide whether that person may open a particular document. Here only the document's owner has permission.",
    "Change the owner to Mira. Try reader and then Mira. Which person can now open the document?"
  ],
  [
    "A password hash is a value made from a password for verification. A password library checks the submitted password against the stored hash. This example starts after that check and decides what the user sees.",
    "Change the success message to Welcome back. Run with pass and fail. Only a successful check should use your new message."
  ],
  [
    "Sending a receipt can take longer than accepting an order. The server puts that work in a queue, a waiting line. A separate worker takes the oldest waiting job when it is ready.",
    "Put two jobs in the starting queue. Add a third using the input. Predict which job the worker takes and which two remain."
  ],
  [
    "A cache holds a convenient copy of something that takes longer to fetch. On a hit the server uses the copy. On a miss it asks the database. This example shows which path each key takes.",
    "Add b12 with the title Dawn to the cache. Compare b12 and b13 and inspect the source field."
  ],
  [
    "If a confirmation gets lost, a customer may submit the same order twice. A retry key labels both attempts as the same purchase. The server can return the original receipt when it sees that key again.",
    "Change the second submit call to use input + '-new'. Compare the receipt numbers with the original pair."
  ],
  [
    "An integration test checks that parts of a system work together. For example, a request should reach the right handler and return the expected status and body. Here you can experiment with the final check against a sample response.",
    "Change the response body's ok value to false. Keep the expected status at 200. Why does the test now fail?"
  ],
  [
    "One request can involve several services. A trace ID groups their work together. Each recorded piece of work is a span, and a parent ID tells you which earlier span led to it.",
    "Add cache as a third service. Look at its trace, span, and parent fields to see how it links to the earlier work."
  ],
  [
    "A replica is one running copy of a service. During a rolling deployment, new copies become ready while old copies still handle requests. This model keeps three copies serving as the mix changes.",
    "Model four replicas by changing both the upper limit and the subtraction from 3 to 4. Update the input hint, then test 0, 2, and 4."
  ]
] as const;
