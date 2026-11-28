export const foundations = [
  {
    "title": "Write your first line of backend logic",
    "intro": "You will build a tiny bookshelf. Someone will ask for a book by its number, and your program will answer with its title. Start here even if you have never written JavaScript.",
    "frames": [
      [
        "Input",
        "42",
        "A visitor types 42. The input box gives your program the text \"42\"."
      ],
      [
        "Lookup",
        "books[input]",
        "An object stores pairs of keys and values. The square brackets look for the key 42 and find its title."
      ],
      [
        "Result",
        "Night Train",
        "return sends the title back to the sandbox. Change the title and the answer changes too."
      ]
    ],
    "demo": [
      "Book number",
      "42",
      "const books = { \"42\": \"Night Train\" };\nreturn books[input] ?? \"Book missing\";"
    ],
    "task": "Add a comma after the first title and a second pair, \"7\": \"Moonrise\". Run with 7, then with 8. One should give the new title and the other should say Book missing.",
    "build": "Write down two book numbers and titles for your own shelf. Use both in the editor. The name books refers to the whole collection; const gives that collection a name you can use again."
  },
  {
    "title": "Run JavaScript on your computer",
    "intro": "Node.js runs JavaScript on your computer. A terminal is a window where you type commands. First make the same lookup work there, before adding a browser or a network.",
    "frames": [
      [
        "Terminal",
        "node shelf.mjs 42",
        "The terminal starts Node, tells it which file to run, and passes 42 as an extra word."
      ],
      [
        "Node",
        "process.argv[2]",
        "Node puts command-line words in a list. The first two entries identify Node and the file. Entry 2 holds your book number because counting starts at zero."
      ],
      [
        "Output",
        "Night Train",
        "console.log writes the answer in the terminal. The program has finished, so you can type another command."
      ]
    ],
    "demo": [
      "Command-line argument",
      "42",
      "const args = [\"node\", \"shelf.mjs\", input];\nconst books = { \"42\": \"Night Train\" };\nreturn books[args[2]] ?? \"Book missing\";"
    ],
    "task": "Change args[2] to args[1]. Predict which key the program will look for. Restore 2 and run again.",
    "build": "Install Node.js LTS from nodejs.org. Make a folder named bookshelf, open it in your editor, and open a terminal in that folder. Run node --version to check installation. Save the code below as shelf.mjs, then run node shelf.mjs 42. Try a missing number too.",
    "snippet": "const books = { \"42\": \"Night Train\" };\nconst id = process.argv[2];\nconsole.log(books[id] ?? \"Book missing\");"
  },
  {
    "title": "Answer a browser with a server",
    "intro": "Your command-line program handles one lookup and exits. A server stays running and waits for messages. HTTP is the set of rules the browser and server use to ask for something and send back an answer.",
    "frames": [
      [
        "Browser",
        "GET /books/42",
        "Opening the book address asks to read something. GET means read, and the path says which book."
      ],
      [
        "Server",
        "find book 42",
        "The server extracts the number from the path and looks it up in the same collection you used in the terminal."
      ],
      [
        "Browser",
        "200 · Night Train",
        "The response has a status number and a body. Here 200 means the lookup worked, and the body contains the title. A missing book gets 404."
      ]
    ],
    "demo": [
      "Request path",
      "/books/42",
      "const books = { \"42\": \"Night Train\" };\nconst title = books[input.slice(\"/books/\".length)];\nreturn title ? { status: 200, title } : { status: 404 };"
    ],
    "task": "Add book 7 to the object. Test /books/7 and /books/8. Explain why changing just the last character changes the status.",
    "build": "Save this as server.mjs beside shelf.mjs. Run node server.mjs and leave that terminal open. Visit http://localhost:3000/books/42 in your browser. Localhost means this computer. Try /books/99, then press Ctrl+C in the terminal to stop the server.",
    "snippet": "import { createServer } from \"node:http\";\nconst books = { \"42\": \"Night Train\" };\n\ncreateServer((request, response) => {\n  const path = new URL(request.url, \"http://localhost\").pathname;\n  const match = /^\\/books\\/(\\d+)$/.exec(path);\n  const title = match && books[match[1]];\n  response.writeHead(title ? 200 : 404, { \"Content-Type\": \"application/json\" });\n  response.end(JSON.stringify(title ? { title } : { error: \"Book missing\" }));\n}).listen(3000, \"127.0.0.1\");"
  },
  {
    "title": "Give the bookshelf a data file",
    "intro": "Your titles currently live inside the program. Move them into a file so you can update the shelf separately from the code. JSON is a text format for data. Its keys and text values use double quotes.",
    "frames": [
      [
        "File",
        "books.json",
        "Save your titles on disk. They stay there when you stop Node."
      ],
      [
        "Server",
        "JSON.parse(text)",
        "On startup Node reads the file as text. Parsing turns that text into an object the lookup can use."
      ],
      [
        "Reader",
        "GET /books/7",
        "The browser asks the same question as before. This time the answer comes from the collection loaded from your file."
      ]
    ],
    "demo": [
      "Shelf as JSON",
      "{\"42\":\"Night Train\",\"7\":\"Moonrise\"}",
      "const books = JSON.parse(input);\nreturn { count: Object.keys(books).length, firstTitle: books[\"42\"] };"
    ],
    "task": "Add a third book to the JSON input and run it. Then remove a comma to see a parsing error. Put the comma back to recover.",
    "build": "Create books.json beside server.mjs using the example below. In server.mjs replace the const books line with the two lines shown under Load the file. Start Node again and open /books/7. To check your project, change the title in the file, restart Node, and refresh. A known book should show the new title and an unknown one should still return 404.",
    "snippet": "{\n  \"42\": \"Night Train\",\n  \"7\": \"Moonrise\"\n}"
  }
] as const;
