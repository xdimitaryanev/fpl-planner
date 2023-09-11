import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'https://fantasy.premierleague.com/api',
  changeOrigin: true,
  secure: false, // only for development
  onProxyRes: (proxyRes, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  },
});

const server = http.createServer((req, res) => {
  proxy(req, res);
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});