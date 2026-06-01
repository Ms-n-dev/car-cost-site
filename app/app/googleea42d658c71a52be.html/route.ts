export async function GET() {
  return new Response(
    "google-site-verification: googleea42d658c71a52be.html",
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}