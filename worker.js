export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originalPath = url.pathname;

    // Rewrite ke wasabi bucket digipanel
    const targetUrl = `https://s3.ap-southeast-1.wasabisys.com/digipanel${originalPath}`;

    // Deteksi ekstensi file
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
    const extension = originalPath.split('.').pop().toLowerCase();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
    });

    if (imageExtensions.includes(extension)) {
      // Kalau gambar, tampilkan biasa
      return response;
    } else {
      // Kalau selain gambar, paksa download
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Content-Disposition', 'attachment');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  }
};
