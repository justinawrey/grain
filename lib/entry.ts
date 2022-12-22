function csr(): Response {
  return new Response(
    `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Grain App</title>
    <script type="module" src="/app.js"></script>
  </head>
  <body>
  </body>
  </html>`,
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
}

export { csr };
