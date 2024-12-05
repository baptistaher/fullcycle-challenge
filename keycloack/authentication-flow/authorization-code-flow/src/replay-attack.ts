const url =
  "http://localhost:3000/callback?session_state=64d28c49-7883-45fb-8441-164109217333&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Ffullcycle-realm&code=ba26f3ce-8a93-41ec-a7e6-b1a774dd74e2.64d28c49-7883-45fb-8441-164109217333.f20e98aa-d57f-4dbe-af4e-f4bd14c6228d";

const request1 = fetch(url);
const request2 = fetch(url);

Promise.all([request1, request2]).then(async (responses) =>
  Promise.all(responses.map((response) => response.json())).then((jsons) =>
    console.log(jsons)
  )
);
