export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originalPath = url.pathname;

    // Target URL ke bucket Wasabi
    const targetUrl = `https://s3.ap-southeast-1.wasabisys.com/digipanel${originalPath}`;

    // Deteksi ekstensi gambar
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
    const extension = originalPath.split('.').pop().toLowerCase();

    // Fetch file dari Wasabi
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
    });

    // Clone headers response
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*'); // ✨ Fix CORS

    if (imageExtensions.includes(extension)) {
      // Kalau gambar, tampilkan biasa (plus CORS header)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } else {
      // Kalau selain gambar, paksa download
      newHeaders.set('Content-Disposition', 'attachment');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  }
};
