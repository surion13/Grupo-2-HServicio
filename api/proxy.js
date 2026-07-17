export default async function handler(req, res) {
  // Construimos la URL completa para el backend
  const targetUrl = 'https://www.hs-api.devfunval.cloud' + req.url.replace('/api', '');

  console.log(`Proxying request to: ${targetUrl}`); // Esto aparecerá en los logs de Vercel

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: 'www.hs-api.devfunval.cloud',
    },
    body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();

  // Borramos headers conflictivos y ponemos los nuestros
  res.setHeader('Access-Control-Allow-Origin', 'https://grupo2-indol.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  res.status(response.status).json(data);
}