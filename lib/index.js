"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Entry point of the discord bot
 */
const Discord = require("discord.js");
const constants_1 = require("./constants");
// Init
const client = new Discord.Client();
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", msg => {
    // Detect that we are needed
    const command = msg.content.split(" ");
    if (command[0] === "/gumjoe") {
        switch (command[1]) {
            case constants_1.QUIZ_COMMAND:
                msg.channel.send("Hi! I am the Gum Joe Bot!");
                msg.channel.send("I am still in active development, but expect new features soon");
        }
    }
});
client.login("NDI1Mzk3NzM0MTc1MTQ2MDA0.DZG5hw.1zKMx9bRIYjE_suwL1eMVGBIutA");
//# sourceMappingURL=index.js.map