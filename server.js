const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let bookings = [];
let idCounter = 1;

/* ---------------- ROOT: HOMEPAGE ---------------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------------- CREATE BOOKING ---------------- */
app.post("/bookings", (req, res) => {
  const booking = {
    id: idCounter++,
    status: "PENDING",
    providerStatus: "NOT_ASSIGNED",
    logs: ["Booking created"]
  };
  bookings.push(booking);
  res.json(booking);
});

/* ---------------- ASSIGN PROVIDER ---------------- */
app.post("/bookings/:id/assign", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  if (!booking) return res.status(404).send("Booking not found");

  booking.status = "ASSIGNED";
  booking.providerStatus = "PENDING_RESPONSE";
  booking.logs.push("Provider assigned, waiting for response");
  res.json(booking);
});

/* ---------------- PROVIDER VIEW ---------------- */
app.get("/provider/bookings", (req, res) => {
  const assigned = bookings.filter(
    b => b.status === "ASSIGNED" && b.providerStatus === "PENDING_RESPONSE"
  );
  res.json(assigned);
});

/* ---------------- PROVIDER ACCEPT ---------------- */
app.post("/bookings/:id/provider/accept", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  booking.providerStatus = "ACCEPTED";
  booking.logs.push("Provider accepted booking");
  res.json(booking);
});

/* ---------------- PROVIDER REJECT (RETRY) ---------------- */
app.post("/bookings/:id/provider/reject", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  booking.providerStatus = "REJECTED";
  booking.status = "PENDING";
  booking.logs.push("Provider rejected booking, retry initiated");
  res.json(booking);
});

/* ---------------- START SERVICE ---------------- */
app.post("/bookings/:id/start", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  if (booking.providerStatus !== "ACCEPTED") {
    return res.status(400).send("Provider has not accepted");
  }
  booking.status = "IN_PROGRESS";
  booking.logs.push("Service started");
  res.json(booking);
});

/* ---------------- COMPLETE SERVICE ---------------- */
app.post("/bookings/:id/complete", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  booking.status = "COMPLETED";
  booking.logs.push("Service completed");
  res.json(booking);
});

/* ---------------- CANCEL ---------------- */
app.post("/bookings/:id/cancel", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  booking.status = "CANCELLED";
  booking.logs.push("Booking cancelled");
  res.json(booking);
});

/* ---------------- ADMIN OVERRIDE ---------------- */
app.post("/bookings/:id/admin", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  booking.status = req.body.status;
  booking.logs.push(`Admin forced status to ${req.body.status}`);
  res.json(booking);
});

/* ---------------- OBSERVABILITY ---------------- */
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

/* ---------------- SERVER ---------------- */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
