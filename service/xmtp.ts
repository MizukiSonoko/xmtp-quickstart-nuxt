import { Client } from '@xmtp/xmtp-js'
import { Signer } from "@/service/web3";

export type Message = {
  from: string
  content: string
  sent: Date
}

export class XmtpClient { 
  client: Client | null;
  constructor() {
   this.client = null;
  }

  public async init(singer: Signer) {
    this.client = await Client.create(singer);
  } 

  public async getMessagesFrom(addr: string): Promise<Message[]> {
    const conversation = await this.client!.conversations.newConversation(
      addr
    )
    const messages = await conversation.messages();
    return messages.map((msg): Message => {
      return {
        from: msg.senderAddress,
        content: msg.content,
        sent: msg.sent,
      }
    });
  }

  public async sendMessage(message: string, addr: string): Promise<Message> {
    const conversation = await this.client!.conversations.newConversation(
      addr
    )
    const decMsg = await conversation.send(message);
    return {
      from: decMsg.senderAddress,
      content: decMsg.content,
      sent: decMsg.sent,
    }
  }
}
