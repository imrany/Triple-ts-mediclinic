import makeWASocket, { DisconnectReason, useMultiFileAuthState, getContentType } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
// import { fileURLToPath } from 'url';
import { config } from "dotenv";
import { sessionName } from "./config.json"
import path from "path";
import * as fs from "fs";
import { checkCommandAndRespond } from './commands';
config();

const API_URL = process.env.API_URL as string;
export let qrcodeData: string = ''

// 120363418543654330@g.us - villebiz group
export async function connectToWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState(path.resolve(`${sessionName}-session`))
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state
  })
  // this will be called as soon as the credentials are updated
  sock.ev.on ('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr }:any= update
    if (qr) {
      qrcodeData = qr;
    }
    if(connection === 'close') {
      let reason = (lastDisconnect.error as Boom)?.output?.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete ${sessionName}-session and Scan Again`)
        sock.logout()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log('Connection closed, reconnecting....')
        connectToWhatsApp()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log('Connection Lost from Server, reconnecting...')
        connectToWhatsApp()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log('Connection Replaced, Another New Session Opened, Please Close Current Session First')
        sock.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete ${sessionName}-session and Scan Again.`)
        fs.rm(`${path.resolve(`${sessionName}-session`)}`, { recursive: true }, (err) => {
          if (err) {
            console.error('Error deleting folder:', err);
          } else {
            console.log('Folder and contents deleted successfully');
          }
        })
        sock.logout()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log('Restart Required, Restarting...')
        connectToWhatsApp()
      } else if (reason === DisconnectReason.timedOut) {
        console.log('Connection TimedOut, Reconnecting...')
        connectToWhatsApp()
      } else {
        const error = `Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`;
        console.error(error);
        connectToWhatsApp();
      }
    } else if(connection === 'open') {
      console.log('opened connection')
    }
  })

  // Event: Messages received
  sock.ev.on('messages.upsert', async (m) => {
    const isbot=m.messages[0].key.fromMe //true or false
    const msg = m.messages[0]; // received message
    const from:any = msg.key.remoteJid; // 254700000000@s.whatsapp.net
    const isGroup = from.endsWith('@g.us'); // 254700000000@g.us
    const isNewsLetter = from.endsWith('@newsletter'); // 120363162145046745@newsletter
    const isBroadcast = from.endsWith('@broadcast'); // status@broadcast
    const type=m.type
    // const type = getContentType(msg.message)


    if (!msg.message) return; // Ignore system messages
    if (isNewsLetter||isBroadcast) return; // Ignore news letter messages/ updates or broadcast
    if (type !== 'notify') return

    // Extract message content
    const content =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption;

    console.log( `From: ${from}`, `isbot: ${isbot}`,`Type: ${type}`,`Message received: ${content}`);
    // auto reply
    // if(!isbot){
      if (content) {
        if (!isGroup) {
          // Send a reply for private messages
          checkCommandAndRespond(m,sock)
        } else {
          // Example for groups: reply only to tagged messages 
          const bot: any = sock.user; // bot's WhatsApp account
          if (bot?.id && msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(bot.id)) {
            await sock.sendMessage(from, {
              text: `Unlock unparalleled business opportunities with Villebiz! 🚀 Whether you're looking to offer or discover top-notch goods and services, we've got you covered. Join our thriving community of businesses and take your success to the next level.\nClick here to experience the future of online brokerage: https://villebiz.com 🌟`,
            });
          }
        }
      }
    // }else{
    //   console.log("Texting yourself")
    // }
  })
  return sock
}