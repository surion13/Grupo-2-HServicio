export default async function handler(req, res) {
  const targetUrl = 'https://www.hs-api.devfunval.cloud' + req.url.replace('/api', '/api');

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: 'www.hs-api.devfunval.cloud',
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();

  // EL TRUCO PRO:
  // 1. Borramos el '*' que viene del backend.
  // 2. Ponemos tu dominio explícito.
  res.setHeader('Access-Control-Allow-Origin', 'https://grupo2-indol.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Pasamos la cookie recibida hacia el navegador
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    res.setHeader('Set-Cookie', setCookie);
  }

  res.status(response.status).json(data);
}