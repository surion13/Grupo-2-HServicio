export default async function handler(req, res) {
  // Construimos la URL final hacia el backend real
  const targetUrl = 'https://www.hs-api.devfunval.cloud/api' + req.url.replace('/api', '');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: 'www.hs-api.devfunval.cloud',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Sobrescribimos los headers de CORS para que el navegador no se queje
    res.setHeader('Access-Control-Allow-Origin', 'https://grupo2-indol.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Pasamos las cookies si el backend las envió
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}