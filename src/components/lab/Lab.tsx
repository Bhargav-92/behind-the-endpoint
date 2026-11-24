"use client";

import { useState, type FormEvent } from "react";

type Note = { id: number; text: string };
type LabResponse = {
  status: string;
  trace: string;
  data: Note | Note[] | { error: string };
};


export function Lab() {
  const [method, setMethod] = useState("GET");
  const [resource, setResource] = useState("/notes");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [response, setResponse] = useState<LabResponse | null>(null);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resource !== "/notes") {
      setResponse({ status: "404 Not Found", trace: "Router → no matching route", data: { error: "Unknown route" } });
    } else if (method === "GET") {
      setResponse({ status: "200 OK", trace: "Router → handler → read collection", data: notes });
    } else if (!text.trim()) {
      setResponse({ status: "422 Unprocessable Content", trace: "Router → validation failed", data: { error: "Note text is required" } });
    } else {
      const note = { id: notes.length + 1, text: text.trim() };
      setNotes([...notes, note]);
      setResponse({ status: "201 Created", trace: "Router → validation → insert", data: note });
    }
  }

  return (
    <>
      <div className="crumb">Course / Request lab</div>
      <h1>Request lab</h1>
      <p className="intro">Send simulated requests to a notes API. Watch validation and storage change the response.</p>
      <section className="box">
        <h2>Notes API</h2>
        <form className="grid justify-items-start gap-4" id="send" onSubmit={send}>
          <div className="bar">
            <label>Method<select id="method" value={method} onChange={event => setMethod(event.target.value)}>
              <option>GET</option><option>POST</option>
            </select></label>
            <label>Resource<select id="path" value={resource} onChange={event => setResource(event.target.value)}>
              <option>/notes</option><option>/missing</option>
            </select></label>
          </div>
          {method === "POST" && (
            <label id="bodyfield">Note text <input id="note" maxLength={160} placeholder="Write a note"
              value={text} onChange={event => setText(event.target.value)} /></label>
          )}
          <button className="primary">Send request</button>
        </form>
      </section>
      <section className="box" aria-live="polite">
        <h2>Response</h2>
        <div id="response">
          {response ? <><strong>{response.status}</strong><p>{response.trace}</p><pre>{JSON.stringify(response.data, null, 2)}</pre></> : "Waiting for a request."}
        </div>
      </section>
    </>
  );
}

