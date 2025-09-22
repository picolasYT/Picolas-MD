import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Número del bot (opcional, solo si usas opción 2 con código de texto de 8 dígitos)
global.botNumber = "" // Ejemplo: 5492994587598

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Dueños del bot
global.owner = [
  "5492994587598", // tu número principal
  "5492994587598", // extra si querés
]

// Tags y premium
global.suittag = ["5492994587598"]
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Info técnica
global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2 | Latest"
global.nameqr = "Picolas-MD"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.enableSubBots = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Branding Picolas
global.botname = "☆ {ℙ𝕚𝕔𝕠𝕝𝕒𝕤-𝐌𝐃} ☆"
global.textbot = "Bot hecho con 💚 por | Picolas | "
global.dev = "© Powered by Picolas"
global.author = "© Picolas Dev Team"
global.etiqueta = "Picolas-MD"
global.currency = "💎"
global.banner = "https://files.catbox.moe/k05foi.jpg" // cambia por tu imagen
global.icono = "https://files.catbox.moe/k05foi.jpg"   // cambia por tu icono
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Enlaces oficiales
global.group = "https://chat.whatsapp.com/xxxxxx"
global.community = "https://chat.whatsapp.com/yyyyyy"
global.channel = "https://whatsapp.com/channel/0029VbBY6fkAzNbo3NqVBN33"
global.github = "https://github.com/picolasYT/Picolas-MD"
global.gmail = "picolasoporte@gmail.com"
global.ch = {
  ch1: "120363323725089388@newsletter"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// APIs (ejemplo, puedes sumar más)
global.APIs = {
  zenz: { url: "https://zenzapis.xyz", key: null },
  lol: { url: "https://api.lolhuman.xyz", key: null }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Auto-reload al guardar cambios
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
