"use client"
import React, { useState, useEffect } from 'react';
import { ChatService } from '../../services/chat_connect';
import type { PartialMessage } from '@bufbuild/protobuf';

import { createConnectTransport } from '@connectrpc/connect-web'
import { createPromiseClient } from '@connectrpc/connect';
import { ChatMessage } from '../../services/chat_pb';
import { stdin, stdout }from 'process'

const connectTrasnport = createConnectTransport({
    baseUrl: 'http://localhost:50051',
    })

const client = createPromiseClient(ChatService, connectTrasnport);

const ChatComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    processChatStream()

    return () => {
      // cleanup
    };
  }, []);

  async function processChatStream() {
    try{

      const req: PartialMessage<ChatMessage> = {
        sender: "client",
        receiver: "server",
        content: currentMessage,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
      }

        for await (const response of client.chat(req)) {
            setMessages(oldMessages => [...oldMessages, response.content]);
            }
        } catch(err) {
            console.error('Error', err)
        }
    }

    const sendMessage = async () => {
        if (!currentMessage.trim()) return; // 空のメッセージは送信しない
        processChatStream()
    };

  return (
    <div>
      <input
        type="text"
        value={currentMessage}
        onChange={e => setCurrentMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
