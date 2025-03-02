export function onRequestGet() {
  return "hi";
}

export function onRequestPost() {
  console.log("POST request received");
  return new Response(JSON.stringify({ message: "hi" }), {
    headers: { "Content-Type": "application/json" },
  });
}
