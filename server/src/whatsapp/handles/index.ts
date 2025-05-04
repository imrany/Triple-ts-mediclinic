import axios from 'axios';
import { sessionName } from "../config.json"
import { config } from "dotenv";
import { downloadContentFromMessage, getContentType } from '@whiskeysockets/baileys';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sock } from '../..';
config()

const GEMINI_API_KEY=process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function addToGroup(jid:string,participants:string[]){
  try{
    await (await sock).groupParticipantsUpdate(
      jid, 
      // ['abcd@s.whatsapp.net', 'efgh@s.whatsapp.net'],
      participants,
      'add' // replace this parameter with 'remove' or 'demote' or 'promote'
    )
    return 'Participant added to group sucessfully'
  }catch(error:any){
    return error.message as string
  }
}
export async function AiHandle(text:string, from:string, sock:any,msg:any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp"});
    const result = await model.generateContent(text);
    const response = result.response;
    let markdown=response.text()

    await sock.sendMessage(from, {
      text: markdown,
    }, {
      quoted: msg
    });
  } catch (error:any) {
    console.error('Request failed:', error);
    await sock.sendMessage(from, {
        text: `Error: ${error.message}`,
    }, {
      quoted: msg
    });
  }
}

export async function getGIFHandle(text:string,from:string,sock:any,msg:any,reply:any){
  try {
    let { data: gi } = await axios.get(`https://g.tenor.com/v1/search?q=${text}&key=LIVDSRZULELA&limit=8`)
    sock.sendMessage(from, {
      video: {
        url: gi.results?.[Math.floor(Math.random() * gi.results.length)]?.media[0]?.mp4?.url
      },
      caption: "Crownus👽\nHere you go",
      gifPlayback: true
    }, {
      quoted: msg
    })
  } catch (err:any) {
    reply("Couldn't find")
    console.log(err)
  }
}

export async function factHandle(reply:any){
  try {
    const { data:response } =await axios.get(`https://nekos.life/api/v2/fact`)
    console.log(response);
    const tet = `📛Fact:~> ${response.fact}`
    reply(tet)
  } catch (error:any) {
    reply(`Cannot get a fact`)
  }
}

export async function definitionHandle(text:string,reply:any) {
  try {
    let def = await axios.get(`http://api.urbandictionary.com/v0/define?term=${text}`)
    if (!def) return reply(`${text} isn't a valid text`)
    const defi = `
Word:~> ${text}

Definition:~> ${def.data.list[0].definition
.replace(/\[/g, "")
.replace(/\]/g, "")}

💭 Example:~> ${def.data.list[0].example
.replace(/\[/g, "")
.replace(/\]/g, "")}
       `
    reply(defi)
  } catch (err:any) {
    console.log(err.toString())
    return reply("Sorry could not find the definition!")
  }
}

export async function helpHandle(senderName:string,reply:any){
  try {
    reply(`Hi ${senderName}, I'm ${sessionName}👽 
    🤖 *Command List* 🤖

ℹ️ *Mods*:-

~> \`\`\`ytsearch, play, ytaudio, lyrics, ytvideo\`\`\`\
\n\n⭐️ *Fun*:-

~> \`\`\`reaction, truth, sadcat, dare, advise, fact\`\`\`\
\n\n💮 *Web*:-

~> \`\`\`githubsearch, github, google, upload, imagesearch, img, define, wikipedia, gify, sticker, image\`\`\`\
\n\n📛 *Moderation*:-

\n\n📗 *Note*~> Use this bot responsibly, I'm not liable for any misuse and misconduction.
\nSupport us by following us on GitHub:
\nhttps://github.com/imrany/whatsapp-bot
\n Till number: 9655689
`)
    return;
  } catch (e:any) {
    reply(e.message)
  }
}