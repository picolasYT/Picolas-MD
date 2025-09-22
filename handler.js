import { smsg } from "./lib/simple.js"
import { format } from "util"
import { fileURLToPath } from "url"
import path, { join } from "path"
import fs, { unwatchFile, watchFile } from "fs"
import chalk from "chalk"
import fetch from "node-fetch"
import ws from "ws"

const { proto } = (await import("@whiskeysockets/baileys")).default
const isNumber = x => typeof x === "number" && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
  clearTimeout(this)
  resolve()
}, ms))

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  this.uptime = this.uptime || Date.now()
  if (!chatUpdate) return
  this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return
  if (global.db.data == null)
    await global.loadDatabase()
  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = 0
    try {
      let user = global.db.data.users[m.sender]
      if (typeof user !== "object")
        global.db.data.users[m.sender] = {}
      if (user) {
        if (!("name" in user)) user.name = m.name
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.coin)) user.coin = 0
        if (!isNumber(user.bank)) user.bank = 0
        if (!isNumber(user.level)) user.level = 0
        if (!isNumber(user.health)) user.health = 100
        if (!("genre" in user)) user.genre = ""
        if (!("birth" in user)) user.birth = ""
        if (!("marry" in user)) user.marry = ""
        if (!("description" in user)) user.description = ""
        if (!("packstickers" in user)) user.packstickers = null
        if (!("premium" in user)) user.premium = false
        if (!user.premium) user.premiumTime = 0
        if (!("banned" in user)) user.banned = false
        if (!("bannedReason" in user)) user.bannedReason = ""
        if (!isNumber(user.commands)) user.commands = 0
        if (!isNumber(user.afk)) user.afk = -1
        if (!("afkReason" in user)) user.afkReason = ""
        if (!isNumber(user.warn)) user.warn = 0
      } else global.db.data.users[m.sender] = {
        name: m.name,
        exp: 0,
        coin: 0,
        bank: 0,
        level: 0,
        health: 100,
        genre: "",
        birth: "",
        marry: "",
        description: "",
        packstickers: null,
        premium: false,
        premiumTime: 0,
        banned: false,
        bannedReason: "",
        commands: 0,
        afk: 0,
        afkReason: "",
        warn: 0
      }
      let chat = global.db.data.chats[m.chat]
      if (typeof chat !== 'object')
        global.db.data.chats[m.chat] = {}
      if (chat) {
        if (!("isBanned" in chat)) chat.isBanned = false
        if (!("welcome" in chat)) chat.welcome = true
        if (!("sWelcome" in chat)) chat.sWelcome = ""
        if (!("sBye" in chat)) chat.sBye = ""
        if (!("detect" in chat)) chat.detect = true
        if (!("primaryBot" in chat)) chat.primaryBot = null
        if (!("modoadmin" in chat)) chat.modoadmin = false
        if (!("antiLink" in chat)) chat.antiLink = true
        if (!("nsfw" in chat)) chat.nsfw = false
        if (!("economy" in chat)) chat.economy = true
        if (!("gacha" in chat)) chat.gacha = true
      } else global.db.data.chats[m.chat] = {
        isBanned: false,
        welcome: true,
        sWelcome: "",
        sBye: "",
        detect: true,
        primaryBot: null,
        modoadmin: false,
        antiLink: true,
        nsfw: false,
        economy: true,
        gacha: true
      }
      var settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== "object")
        global.db.data.settings[this.user.jid] = {}
      if (settings) {
        if (!("self" in settings)) settings.self = false
        if (!("restrict" in settings)) settings.restrict = true
        if (!("jadibotmd" in settings)) settings.jadibotmd = true
        if (!("antiPrivate" in settings)) settings.antiPrivate = false
        if (!("gponly" in settings)) settings.gponly = false
      } else global.db.data.settings[this.user.jid] = {
        self: false,
        restrict: true,
        jadibotmd: true,
        antiPrivate: false,
        gponly: false
      }
    } catch (e) {
      console.error(e)
    }

    if (typeof m.text !== "string") m.text = ""
    const user = global.db.data.users[m.sender]
    try {
      const actual = user.name || ""
      const nuevo = m.pushName || await this.getName(m.sender)
      if (typeof nuevo === "string" && nuevo.trim() && nuevo !== actual) {
        user.name = nuevo
      }
    } catch {}

    const chat = global.db.data.chats[m.chat]
    const conn = m.conn || global.conn
    const setting = global.db.data.settings[conn?.user?.jid]

    const isROwner = [...global.owner.map((number) => number)].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender) || user.premium == true

    if (opts["nyimak"]) return
    if (!m.fromMe && setting["self"]) return
    if (!m.fromMe && setting["gponly"] && !m.chat.endsWith("g.us") && !/code|p|ping|qr|estado|status|infobot|botinfo|report|reportar|invite|join|logout|suggest|help|menu/gim.test(m.text)) return
    if (opts["swonly"] && m.chat !== "status@broadcast") return
    if (opts["queque"] && m.text && !(isPrems)) {
      const queque = this.msgqueque, time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        await delay(time)
      }, time)
    }

    if (m.isBaileys) return
    m.exp += Math.ceil(Math.random() * 10)
    let usedPrefix

    const groupMetadata = m.isGroup ? { ...(conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}), ...(((conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}).participants) && { participants: ((conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}).participants || []).map(p => ({ ...p, id: p.jid, jid: p.jid, lid: p.lid })) }) } : {}
    const participants = ((m.isGroup ? groupMetadata.participants : []) || []).map(participant => ({ id: participant.jid, jid: participant.jid, lid: participant.lid, admin: participant.admin }))
    const userGroup = (m.isGroup ? participants.find((u) => conn.decodeJid(u.jid) === m.sender) : {}) || {}
    const botGroup = (m.isGroup ? participants.find((u) => conn.decodeJid(u.jid) == this.user.jid) : {}) || {}
    const isRAdmin = userGroup?.admin == "superadmin" || false
    const isAdmin = isRAdmin || userGroup?.admin == "admin" || false
    const isBotAdmin = botGroup?.admin || false

    // ... resto del código sin cambios, manejo de plugins, permisos y ejecución ...

  } catch (err) {
    console.error(err)
  } finally {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1)
        this.msgqueque.splice(quequeIndex, 1)
    }
    let user, stats = global.db.data.stats
    if (m) {
      if (m.sender && (user = global.db.data.users[m.sender])) {
        user.exp += m.exp
      }}
    try {
      if (!opts["noprint"]) await (await import("./lib/print.js")).default(m, this)
    } catch (err) {
      console.warn(err)
      console.log(m.message)
    }}
}

global.dfail = (type, m, conn) => {
  const msg = {
    rowner: `『✦』El comando *${comando}* solo puede ser usado por los creadores de *${global.botname}*.`, 
    owner: `『✦』El comando *${comando}* solo puede ser usado por los desarrolladores de *${global.botname}*.`, 
    mods: `『✦』El comando *${comando}* solo puede ser usado por los moderadores de *${global.botname}*.`, 
    premium: `『✦』El comando *${comando}* solo puede ser usado por los usuarios premium.`, 
    group: `『✦』El comando *${comando}* solo puede ser usado en grupos.`,
    private: `『✦』El comando *${comando}* solo puede ser usado en el chat privado de *${global.botname}*.`,
    admin: `『✦』El comando *${comando}* solo puede ser usado por los administradores del grupo.`, 
    botAdmin: `『✦』Para ejecutar el comando *${comando}* debo ser administrador del grupo.`,
    restrict: `『✦』Esta característica está desactivada.`
  }[type]
  if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.magenta("[ Picolas-MD ] → Se actualizó 'handler.js' ✅"))
})
