import { Socket } from "socket.io";
import Whatsapp from "./Whatsapp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class WhatsappManager {
  public whatsapps: Whatsapp[];
  constructor() {
    this.whatsapps = [];
  }

  public async addWhatsapp(id: string, socket: Socket) {
    const whatsapp = new Whatsapp(id, socket);
    this.whatsapps.push(whatsapp);
    whatsapp.init();
    return whatsapp;
  }

  public getWhatsapp(id: string) {
    return this.whatsapps.find((whatsapp) => whatsapp.id === id);
  }

  public getWhatsapps() {
    return this.whatsapps;
  }

  public getWhatsappByIds(ids: string[]) {
    return this.whatsapps.filter((whatsapp) => ids.includes(whatsapp.id));
  }

  public delWhatsapp(id: string) {
    this.whatsapps = this.whatsapps.filter((whatsapp) => whatsapp.id !== id);
    return this.whatsapps;
  }

  public async resetStatus() {
    const wa = await prisma.whatsapp.updateMany({
      where: {
        status: "READY",
      },
      data: {
        status: "DISCONNECTED",
      },
    });

    return true;
  }

  public async register(id: string, socket: Socket) {
    const newWhatsapp = await prisma.whatsapp.upsert({
      where: {
        id,
      },
      create: {
        status: "CREATED",
      },
      update: {
        id,
        status: "UPDATED",
      },
    });

    const whatsapp = await this.addWhatsapp(newWhatsapp.id, socket);
    return whatsapp;
  }
}

const whatsappManager = new WhatsappManager();
whatsappManager.resetStatus();

export { whatsappManager };
