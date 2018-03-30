/**
 * Quiz command
 */
import { Message, Channel, Client, User, GuildMember, Role, Guild, ReactionCollector, CollectorFilter, MessageReaction, Collection, TextChannel } from "discord.js";
import { mapValsToList, getRandomInt } from "../util";
import { QUIZ_GET_LIST, QUIZ_START, QUIZ_MAX_ENTER_TIME, QUIZ_ANSWER_TIME } from "../constants";
import * as config from "../../private/config.json";
import { ConfigQuizRound, ConfigQuizQuestion } from "../interfaces";


async function handlePicking(collectedReactions: MessageReaction | undefined, message: Message): Promise<any> {
  // get users
  return new Promise(async (resolve, reject) => {
    try {
      const usersMap = await collectedReactions.fetchUsers(100);
      const usersList: User[] = mapValsToList(usersMap);
      let contestantList: User[] = [];
      // Pick
      if (usersList.length > 5) {
        for (let i: number = 0; i < config.quiz.contestants; i++) {
          const getIndex: number = getRandomInt(0, usersList.length);
          contestantList.push(usersList[getIndex]);
          message.channel.send("Picked " + usersList[getIndex]);
        }
      } else {
        // PICK ALL USERS
        contestantList = usersList;
        message.channel.send("All users that applied have been picked.  Starting quiz...");
        message.channel.send(`${message.guild.roles.get(config.quiz.roles.contestant)} See ${message.guild.channels.find("name", config.quiz.channel)} for the quiz.`);
      }
      resolve(contestantList);
    } catch (err) {
      reject(err);
    }
  })
}

async function runQuiz(msg: Message): void {
  const quizChan: TextChannel = msg.guild.channels.find("name", config.quiz.channel);
  quizChan.send(`Welcome to the quiz!\nThere are ${config.quiz.rounds.length} rounds, each with ${config.quiz["questions-per-round"]} questions in.`);
  quizChan.send("For each round, simpily respond with JUST the letter that you wish to answer.  Only the first message sent will be accepted.");
  quizChan.send(`You will have ${QUIZ_ANSWER_TIME} to answer each questions`);

  // Loop
  let round: ConfigQuizRound;
  let i: number = 1;
  for (round of config.quiz.rounds) {
    quizChan.send(`**Round ${i}:** ${round.topic}`);
    let question: ConfigQuizQuestion;
    quizChan.send("");
    for (const question of round.questions) {
      quizChan.send(question.question);
      for (const key in question.answers) {
        if (question.answers.hasOwnProperty(key)) {
          quizChan.send(`${key}: ${question.answers[key]}`);
        }
      }
    }
  }
}

async function start(msg: Message, commands: string[]): void {
  try {
    // Step 1: Get list
    const message: Message = await msg.channel.send("@every one The quiz has now started!\nReact to this message with :+1: to enter!\n:smiley: You have 30 mins.");
    // Watch until get :x: to stop
    const filter: CollectorFilter = (reaction, user) => reaction.emoji.name === "👍";
    const collectedReaction: Collection<string, MessageReaction> = await message.awaitReactions(filter, { time: QUIZ_MAX_ENTER_TIME });
    //console.log(collectedReaction);
    const userList: User[] = await handlePicking(collectedReaction.get("👍"), message);
    // Assign Contestant role
    userList.forEach(async (user: User): void => {
      try {
        const member: GuildMember = await message.guild.fetchMember(user);
        member.addRole(member.guild.roles.get(config.quiz.roles.contestant));
      } catch (err) {
        console.error(err.stack);
      }
    });

    // Now run the quiz
    runQuiz(msg);
  } catch (err) {
    console.error(err.stack);
  }
}

export default function (msg: Message, commands: string[]): void {
  switch (commands[0]) {
    // Detect sub command
    case QUIZ_START: 
      start(msg, commands);
      return;

    case QUIZ_GET_LIST:
      pickLegacy(msg, commands);
      return;
  }
}

function pickLegacy(msg: Message, commands: string[]): void {
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
        console.log("Auto pick checking role \"" + role + "\" aginst " + role + " for " + pickedUser.nickname + ": " + (role.toString() === rolesInc));
        if (role.toString() === rolesInc) {
          // Auto-include this contestant
          rolesMatchAutoInc = true;
          break;
        }
      }
      //if (rolesMatchExc || rolesMatchAutoInc) {
      //  break; // Stop loop as contestant has been excluded or auto included
      //}
    }

    // Remove to prevent re pick
    listOfUsers.splice(getIndex, 1);

    if (rolesMatchExc) {
      // Cannot include this contestant, deincrement i to add another interation
      msg.channel.send("Not picking " + pickedUser);
      i--;
      continue;
    }

    // If just auto-include, just add extra interation
    if (rolesMatchAutoInc) {
      msg.channel.send("Autopicking: " + pickedUser);
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