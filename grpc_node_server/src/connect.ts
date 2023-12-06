import { ConnectRouter } from '@connectrpc/connect';
import { Greeter } from './services/greeting_connect'
import { CatImageService } from './services/catimages_connect';
import { ChatService } from './services/chat_connect';
import type { ChatMessage } from './services/chat_pb';
import { PartialMessage } from '@bufbuild/protobuf';


export default (router: ConnectRouter) => {
    // Greeterサービスの設定
    router.service(Greeter, {
        async sayHello(req) {
            // リクエストのnameを使って挨拶文を返す
            return { text: `Hello ${req.name}` };
        },
    });

    // CatImageServiceの設定
    router.service(CatImageService, {
        async getCatImage() {
            // ランダムねこ画像を返す
            return { url: "https://cataas.com/cat"}
        },
    });

    let messages = [];
    router.service(ChatService, {
        async *chat(messages: ChatMessage) {
            //for await (const message of messages) {
                // Implement your chat logic here. For example, you can echo the message back,
                // or implement more complex chat logic.
                const req: PartialMessage<ChatMessage> = {
                    sender: 'Server',
                    receiver: messages.receiver,
                    content: `Server received: ${messages.content}`,
                    timestamp: messages.timestamp,
                };
                yield req;
            //}
        },
    });
};