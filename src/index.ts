/**
 * Entry point of the discord bot
 */
import * as Discord from "discord.js";
import quiz from "./commands/quiz";
import { QUIZ_COMMAND } from "./constants";
import * as config from "../private/config";

// Init
const client: Discord.Client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  // Detect that we are needed
  const command: string[] = msg.content.split(" ");
  if (command[0] === "/gumjoe") {
    console.log("Got a command: " + command[1]);
    const subcommand: string[] = Array.prototype.concat(command);
    subcommand.splice(0, 2);
    switch (command[1]) {
      case QUIZ_COMMAND:
        quiz(msg, subcommand);
    }
  }
});

client.login(config.token);