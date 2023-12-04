import { ConnectRouter } from '@connectrpc/connect';
import { Greeter } from './services/greeting_connect'
import { CatImageService } from './services/catimages_connect';


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
};