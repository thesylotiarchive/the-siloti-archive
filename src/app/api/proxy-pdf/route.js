// /app/api/proxy-pdf/route.js

export async function GET(req) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return new Response("Missing 'url' parameter", { status: 400 });
  
    try {
      const res = await fetch(url);
      if (!res.ok) return new Response("Failed to fetch PDF", { status: 502 });
  
      const buffer = await res.arrayBuffer();
  
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=document.pdf",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response("Proxy error", { status: 500 });
    }
  }
  