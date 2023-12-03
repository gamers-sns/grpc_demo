use greeting::greeter_server::{Greeter, GreeterServer};
use greeting::{GreetingMessage, Person};
use tower_http::cors::{CorsLayer, Any };
use tonic::{transport::Server, Request, Response, Status};
use catimages::cat_image_service_server::{CatImageService, CatImageServiceServer};
use catimages::{CatImageResponse, CatImageRequest};

mod greeting {
    tonic::include_proto!("greeting");
}

#[derive(Default)]
struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: Request<Person>,
    ) -> Result<Response<GreetingMessage>, Status> {
        println!("Got a request: {:?}", request);

        let reply = GreetingMessage {
            text: format!("Hello {}!", request.into_inner().name).into(),
        };

        Ok(Response::new(reply))
    }
}

pub mod catimages {
    tonic::include_proto!("catimages"); // この名前はprotoファイルの`package`名と一致する必要があります。
}

#[derive(Default)]
struct MyCatImageService {}

#[tonic::async_trait]
impl CatImageService for MyCatImageService {
    async fn get_cat_image(
        &self,
        _request: Request<CatImageRequest>,
    ) -> Result<Response<CatImageResponse>, Status> {
        println!("Got a request");

        let reply = CatImageResponse {
            url: format!("https://cataas.com/cat").into()
        };
        Ok(Response::new(reply))
    }
}


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:50051".parse().unwrap();
    let greeter = MyGreeter::default();
    let greeter = GreeterServer::new(greeter);


    let cat_image_service = MyCatImageService::default();
    let cat_image_service = CatImageServiceServer::new(cat_image_service);



    let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

    println!("Greeter listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .layer(cors)
        .add_service(tonic_web::enable(greeter))
        .add_service(tonic_web::enable(cat_image_service))
        .serve(addr)
        .await?;
    Ok(())
}