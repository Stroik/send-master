import type { Socket } from "socket.io";
import { Client, LocalAuth, Message, MessageMedia } from "whatsapp-web.js";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const dbPath = join(process.cwd(), "db", "sessions");
const prisma = new PrismaClient();
const wwebVersion = "2.3000.1014580163-alpha";
const remotePath =
  "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/" +
  wwebVersion +
  ".html";

export interface IMessage {
  phone: string;
  message: string;
  userId: string;
  campaignId: string;
  media?: string | null;
}

export default class Whatsapp extends Client {
  public id: string;
  private socket: Socket;

  constructor(id: string, socket: Socket) {
    super({
      authStrategy: new LocalAuth({
        dataPath: dbPath,
        clientId: `whatsapp-${id}`,
      }),
      webVersionCache: {
        type: "remote",
        remotePath,
      },
      ffmpegPath: `${process.env.FFMPEG_PATH}`,
      puppeteer: {
        headless: true,
        executablePath: `${process.env.BROWSER_PATH}`,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
        ],
      },
    });
    this.id = id;
    this.socket = socket;

    this.on("authenticated", () => {
      this.authenticated();
    });

    this.on("ready", () => {
      this.ready();
    });

    this.on("disconnected", () => {
      this.disconnected();
    });

    this.on("message", async (msg) => {
      await this.onMessage(msg);
    });
  }

  private async authenticated() {
    this.socket.emit("whatsapp-authenticated");
    await prisma.whatsapp.update({
      where: { id: this.id },
      data: { status: "AUTHENTICATED" },
    });
  }

  private async ready() {
    this.socket.emit("whatsapp-ready");
    await prisma.whatsapp.update({
      where: { id: this.id },
      data: {
        status: "READY",
        phone:
          this.info !== undefined
            ? String(this.info.wid._serialized).replace("@c.us", "")
            : undefined,
      },
    });
  }

  private async disconnected() {
    await prisma.whatsapp.update({
      where: { id: this.id },
      data: { status: "DISCONNECTED" },
    });
  }

  public async qrCode() {
    this.on("qr", async (qr: string) => {
      this.socket.emit("qrCode", qr);
    });
  }

  public async validateNumber(phone: string) {
    try {
      const isValid = await this.isRegisteredUser(`${phone}@c.us`);
      return isValid;
    } catch (error) {
      console.log("VALIDATE_NUMBER", error);
      return false;
    }
  }

  public async remove() {
    try {
      await this.destroy();
      return true;
    } catch (error) {
      console.log("LOGOUT", error);
      return false;
    }
  }

  public async sendMsg(message: IMessage) {
    try {
      if (this.info === undefined) throw new Error("NOT_READY");
      if (!(await this.validateNumber(message.phone)))
        throw new Error("INVALID_NUMBER");

      const { phone, message: text, userId, campaignId, media } = message;
      let mediaPath, mediaFile, response;
      if (media) {
        mediaPath = join(__dirname, "..", "..", "..", "public", media);
        mediaFile = MessageMedia.fromFilePath(mediaPath);
      }

      if (mediaFile) {
        response = await this.sendMessage(`${phone}@c.us`, mediaFile, {
          caption: text,
        });
      } else {
        response = await this.sendMessage(`${phone}@c.us`, text);
      }
    } catch (error) {
      console.log("SEND_MSG", error);
    }
  }

  private async onMessage(message: Message) {
    const { body } = message;
    const chat = await message.getChat();

    if (body.startsWith("ping")) {
      await chat.sendMessage("pong 🏓");
    }
  }
}
