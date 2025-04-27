export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originalPath = url.pathname;

    const targetUrl = `https://s3.ap-southeast-1.wasabisys.com/digipanel${originalPath}`;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
    const extension = originalPath.split('.').pop().toLowerCase();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      redirect: 'follow' // ✨ penting untuk amanin redirect dari Wasabi
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');

    if (imageExtensions.includes(extension)) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } else {
      newHeaders.set('Content-Disposition', 'attachment');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  }
};
