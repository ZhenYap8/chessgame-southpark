// Dynamic static dev server with automatic port fallback.
// Tries 8080 upward until a free port is found.
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from './mime-inline.js';
import net from 'net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const START_PORT = 8080;
const MAX_PORT = 8100;

async function findPort(){
  for(let p=START_PORT; p<=MAX_PORT; p++){
    const free = await isFree(p);
    if(free) return p;
  }
  throw new Error('No free port in range '+START_PORT+'-'+MAX_PORT);
}
function isFree(port){
  return new Promise(res=>{
    const srv = net.createServer().once('error', ()=>res(false)).once('listening', ()=>srv.close(()=>res(true))).listen(port, '0.0.0.0');
  });
}

function send(res, code, body, headers={}){ res.writeHead(code, headers); res.end(body); }

async function serveFile(reqPath, res){
  const abs = path.join(ROOT, reqPath);
  try {
    const st = await stat(abs);
    if(st.isDirectory()) return serveFile(path.join(reqPath,'index.html'), res);
    const data = await readFile(abs);
    const ext = path.extname(abs).slice(1).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    send(res, 200, data, { 'Content-Type': type });
  } catch (e){
    send(res, 404, 'Not found');
  }
}

function createStaticServer(){
  return createServer(async (req,res)=>{
    const url = new URL(req.url, 'http://localhost');
    let reqPath = decodeURIComponent(url.pathname);
    if(reqPath === '/') reqPath = '/index.html';
    await serveFile(reqPath, res);
  });
}

const port = await findPort();
const server = createStaticServer();
server.listen(port, ()=>{
  console.log(`Dev server running at http://localhost:${port}`);
  console.log('Serving root:', ROOT);
});
