import { downloadContentFromMessage, getContentType } from "@whiskeysockets/baileys";
import { AiHandle, definitionHandle, factHandle, getGIFHandle, helpHandle } from "../handles";
// @ts-ignore
import { uploadByBuffer, uploadByUrl } from "telegraph-uploader";

export async function checkCommandAndRespond(m:any, sock:any) {
    const msg = m.messages[0]; // received message
    const isbot=m.messages[0].key.fromMe //true or false
    const from:any = msg.key.remoteJid; // 254700000000@s.whatsapp.net
    const type:any = getContentType(msg.message)
    const senderName = msg.pushName
    const quotedType = getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null
    const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id
    console.log(`Bot id: ${botId}, Type: ${type}, quotedType:${quotedType}`)


    // Extract message content
    const content = type == 'conversation' ? msg.message?.conversation : msg.message[type]?.caption || msg.message[type]?.text || ''
    // const content =
    // msg.message.conversation ||
    // msg.message.extendedTextMessage?.text ||
    // msg.message.imageMessage?.caption; // ".ai what is code?"

    const command=content.slice(1).trim().split(' ').shift().toLowerCase() // result "ai"
    const text = content.replace(command, '').slice(1).trim(); //"what is code?"
    const args = content.trim().split(' ').slice(1)
    //Types of messages
    const isImage = type == 'imageMessage'
    const isVideo = type == 'videoMessage'
    const isAudio = type == 'audioMessage' 
    const isSticker = type == 'stickerMessage'
    const isContact = type == 'contactMessage'
    const isLocation = type == 'locationMessage'

    const isQuoted = type == 'extendedTextMessage'
    const isQuotedImage = isQuoted && quotedType == 'imageMessage'
    const isQuotedVideo = isQuoted && quotedType == 'videoMessage'
    const isQuotedAudio = isQuoted && quotedType == 'audioMessage'
    const isQuotedSticker = isQuoted && quotedType == 'stickerMessage'
    const isQuotedContact = isQuoted && quotedType == 'contactMessage'
    const isQuotedLocation = isQuoted && quotedType == 'locationMessage'

    let mediaType = type
    let stream:any
    if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
        mediaType = quotedType
        msg.message[mediaType] = msg.message.extendedTextMessage.contextInfo.quotedMessage[mediaType]
        stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', ''))
            .catch(console.error)
    }

    const reply = async (text:string) => {
        return sock.sendMessage(from, {
            text: text
        }, {
            quoted: msg
        })
    }
    const bufferToUrl = async (buffer:any) => {
        const data = await uploadByBuffer(buffer)
        return data
    }

    switch (command) {
        case "ai": {
                if(!text){
                    reply('Hello, How can I help')
                    return;
                }
                await  AiHandle(text, from, sock, msg);
            }
            break;
        case 'help':{
                await helpHandle(senderName,reply)
            }
            break;
        default:
            if (content&&!isbot) {
                // reply(`Hello! I'm not available at the moment.\n Please get back to me later.`)
            }
            break;
    }
}