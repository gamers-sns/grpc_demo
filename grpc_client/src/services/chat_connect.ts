// @generated by protoc-gen-connect-es v0.13.0 with parameter "target=ts"
// @generated from file chat.proto (package chat, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { ChatMessage } from "./chat_pb.ts";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * チャットサービスを定義します。このサービスでは、クライアントとサーバー間でメッセージを交換できます。
 *
 * @generated from service chat.ChatService
 */
export const ChatService = {
  typeName: "chat.ChatService",
  methods: {
    /**
     * ビディレクショナルストリーミングRPCを使用して、リアルタイムでメッセージを交換します。
     *
     * @generated from rpc chat.ChatService.Chat
     */
    chat: {
      name: "Chat",
      I: ChatMessage,
      O: ChatMessage,
      kind: MethodKind.ServerStreaming,
    },
  }
} as const;

