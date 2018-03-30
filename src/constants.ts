/**
 * Constants
 */

// Commands
export const QUIZ_COMMAND: string = "quiz";
export const QUIZ_GET_LIST: string = "pick";
export const QUIZ_START: string = "start";
export const QUIZ_MAX_ENTER_TIME: number = 15000; // In ms (1000ms = seconds) // Should be 1 * 30 * 60 * 1000 (30 mins)
export const QUIZ_ANSWER_TIME_INT: number = 30 * 1000; // should be 30 secs, 30 * 1000
export const QUIZ_ANSWER_TIME: string = "30 secs";