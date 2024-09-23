import levels from "../config/levels.json";

// Function to calculate XP required for a given level
export function xpForLevel(level: number) {
  return levels[level - 1].points;
}

// Function to calculate current level based on total XP
export function calculateLevel(totalXP: number) {
  let level = 1;

  while (xpForLevel(level) <= totalXP) {
    level++;
  }

  return level;
}

// Function to calculate XP needed for the next level
export function xpToNextLevel(totalXP: number) {
  let level = calculateLevel(totalXP);
  let xpForCurrentLevel = xpForLevel(level);
  let xpForNextLevel = xpForLevel(level + 1);
  return xpForNextLevel - (totalXP - xpForCurrentLevel);
}

export function remainingTimes() {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  // Calculate how many minutes to add to get to the next multiple of 10
  const minutesToAdd = 10 - (currentMinutes % 10);
  // Create a new Date object for the next multiple of 10 minutes
  const nextTenthMinute = new Date(now.getTime() + minutesToAdd * 60000);
  nextTenthMinute.setSeconds(0);
  nextTenthMinute.setMilliseconds(0);

  const nextDay = new Date(now);
  nextDay.setHours(24, 0, 0, 0);

  return nextTenthMinute.valueOf() - now.valueOf(); // remaining time milliseconds
}

export function calculatePoints(
  initTimestamp: number | Date,
  finalTimestamp: number | Date,
  currentTime = new Date(),
) {
  const STABLE_MINUTES_INIT = 15; // minutes
  const STABLE_MINUTES_FINISH = 30; // minutes
  const MAX_POINTS = 3000;
  const MIN_POINTS = 300;

  // Ensure timestamps are Date objects
  initTimestamp = new Date(initTimestamp);
  finalTimestamp = new Date(finalTimestamp);
  currentTime = new Date(currentTime);

  // Calculate the time boundaries
  const firstStableTime = new Date(
    initTimestamp.getTime() + STABLE_MINUTES_INIT * 60 * 1000,
  ); // initTimestamp + 15 minutes
  const lastStableTime = new Date(
    finalTimestamp.getTime() - STABLE_MINUTES_FINISH * 60 * 1000,
  ); // finalTimestamp - 15 minutes

  const epochs =
    (lastStableTime.getTime() - firstStableTime.getTime()) / (15 * 60 * 1000);
  const pointsPerEpoch = (MAX_POINTS - MIN_POINTS) / epochs;

  if (currentTime < initTimestamp || currentTime >= finalTimestamp) {
    return 0;
  }
  // Check if currentTime is within the first 15 minutes
  else if (currentTime < firstStableTime) {
    return MAX_POINTS;
  } else if (currentTime >= lastStableTime) {
    return MIN_POINTS;
  } else {
    const epochNumber =
      (finalTimestamp.getTime() - currentTime.getTime()) / (15 * 60 * 1000);
    const pointsToGive = pointsPerEpoch * (Math.floor(epochNumber) - 1);
    return Math.max(0, pointsToGive + MIN_POINTS); // Ensure points do not go below 0
  }
}
