/**
 * Quiz command
 */
import { Message, Channel, Client, User, GuildMember, Role, Guild } from "discord.js";
import { mapValsToList, getRandomInt } from "../util";
import { QUIZ_GET_LIST } from "../constants";
import * as config from "../../private/config.json";

export default function (msg: Message, commands: string[]): void {
  switch (commands[0]) {
    // Detect sub command
    case QUIZ_GET_LIST:
      msg.channel.send("Picking contestants...");
      const userMap: Map<string, GuildMember> = msg.guild.members;
      const listOfUsers: GuildMember[] = mapValsToList(userMap); // Create user list
      const contestantsList = [];

      // Now random pick
      for (let i: number = 0; i < config.quiz.contestants; i++) {
        const getIndex: number = getRandomInt(0, listOfUsers.length); // Which contestant
        const pickedUser: GuildMember = listOfUsers[getIndex];

        // Verify not one of config.quiz.roles.exclude or needs inclusion
        const userRoles: Role[] = mapValsToList(pickedUser.roles);
        let rolesMatchExc: boolean = false;
        let rolesMatchAutoInc: boolean = false;
        for (const role of userRoles) {
          for (const rolesExc of config.quiz.roles.exclude) {
            if (role.name === rolesExc) {
              // Exclude this contestant
              rolesMatchExc = true;
              break;
            }
          }
          // Include roles
          for (const rolesInc of config.quiz.roles.include) {
            if (role.name === rolesInc) {
              // Auto-include this contestant
              rolesMatchAutoInc = true;
              break;
            }
          }
          if (rolesMatchExc || rolesMatchAutoInc) {
            break; // Stop loop as contestant has been excluded or auto included
          }
        }

        // Remove to prevent re pick
        listOfUsers.splice(getIndex, 1);

        if (rolesMatchExc) {
          // Cannot include this contestant, deincrement i to add another interation
          i--;
          continue;
        }

        // If just auto-include, just add extra interation
        if (rolesMatchAutoInc) {
          i--;
        }
        
        // Add to roles list
        contestantsList.push(pickedUser);
      }

      // Send list
      contestantsList.forEach(element => {
        msg.channel.send("Picked: " + element);
      });
  }
}