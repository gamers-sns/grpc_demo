import { fastify } from 'fastify';
import { fastifyConnectPlugin } from '@connectrpc/connect-fastify';
import cors from '@fastify/cors';
import routes from "./connect";

async function main(){
    const server = fastify();



    // CORSの設定
    await server.register(cors, {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "connect-protocol-version"],
        
        preflight: true,
        optionsSuccessStatus: 204,
    });

    // Connectのルートを登録
    await server.register(
        fastifyConnectPlugin, {
        routes,
        });

    // ここは普通のREST APIのルーティング
    server.get('/', (_, reply) => {
        reply.type('text/html');
        reply.send("Hello World");
    });

    await server.listen({ host: "localhost", port: 50051});
    console.log("Server is running on http://localhost:50051");
}

void main();