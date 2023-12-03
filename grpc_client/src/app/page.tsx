'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import { createPromiseClient } from '@connectrpc/connect'
import { Greeter } from '../services/greeting_connect'
import { CatImageService } from '@/services/catimages_connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'


const transport = createGrpcWebTransport({
  baseUrl: 'http://localhost:50051',
  
});

const greeterClient = createPromiseClient(Greeter, transport);

const catImageClient = createPromiseClient(CatImageService, transport);

export default function Home() {

  const [name, setName] = useState<string>('');
  const [greetingResponse, setGreetingResponse] = useState<string>(''); // 追加された状態


  const [catImageUrl, setCatImageUrl] = useState<string>('');

  const handleGreetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await greeterClient.sayHello({ name })
    console.log(res)
    setGreetingResponse(res.text) // レスポンスを状態にセット
  }

  const handleCatImage = async () => {
    const res = await catImageClient.getCatImage({})
    setCatImageUrl(res.url)
  }


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Connect RPC
        </h1>

        <p className={styles.description}>
          A simple RPC client and server
        </p>

        {/* Greeting form */}
        <form onSubmit={handleGreetSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="submit">Send Greeting</button>
        </form>

        {/* Greeting response display */}
        {greetingResponse && <p>{greetingResponse}</p>} {/* レスポンスを表示 */}

        {/* Cat image button */}
        <button onClick={handleCatImage}>Get Cat Image</button>

        {/* Cat image display */}
        {catImageUrl && <Image src={catImageUrl} alt="Cat" width={500} height={500} />}
      </main>
    </div>
  )
}
