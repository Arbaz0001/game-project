import { GameRound } from "../models/gameRound.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

const getTelegramClient = async () => {
  if (process.env.ENABLE_TELEGRAM !== "true") {
    return null;
  }

  const { TelegramClient } = await import("telegram");
  const { StringSession } = await import("telegram/sessions/index.js");

  const apiId = 23416733;
  const apiHash = "e87f3e11b9917aa1cb3c0cd4f9a3c63c";
  const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.connect();
  return client;
};

const setgameround = asyncHandler(async (req, res) => {
  const { gameType, multipliers, startTime, endTime, channelId, period } =
    req.body;

  if (
    !gameType ||
    !Array.isArray(multipliers) ||
    multipliers.length === 0 ||
    !startTime ||
    !endTime
  ) {
    throw new apiError(
      400,
      "All fields (gameType, multipliers[], startTime, endTime) are required"
    );
  }

  const newGameRound = await GameRound.create({
    gameType,
    multipliers,
    period,
    startTime,
    endTime,
    status: "scheduled",
    createdByBot: false,
    createdByAdmin: true,
    messageSent: false,
  });

  if (process.env.ENABLE_TELEGRAM === "true" && channelId) {
    const client = await getTelegramClient();
    const channel = await client.getEntity(channelId);

    await client.sendMessage(channel, {
      message: `New game round scheduled!\n\nGame Type: ${gameType}\n${
        period ? `Period :` + period : ""
      } \nStart Time: ${new Date(
        startTime
      ).toLocaleString()}\nEnd Time: ${new Date(
        endTime
      ).toLocaleString()}\n Crash Points: ${multipliers.join(", ")}`,
    });
  }

  return res
    .status(201)
    .json(new apiResponse(201, newGameRound, "Game round scheduled successfully"));
});

const getAllGameRounds = asyncHandler(async (req, res) => {
  const { gameType, status } = req.query;

  const filter = {};
  if (gameType) filter.gameType = gameType;
  if (status) filter.status = status;

  const rounds = await GameRound.find(filter).sort({ startTime: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, rounds, "All game rounds fetched successfully"));
});

const deleteGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Game round ID is required");
  }

  const deleted = await GameRound.findByIdAndDelete(id);

  if (!deleted) {
    throw new apiError(404, "Game round not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, deleted, "Game round deleted successfully"));
});

const updateGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gameType, multipliers, startTime, endTime, status, period } =
    req.body;

  if (
    !gameType ||
    !multipliers ||
    !Array.isArray(multipliers) ||
    !startTime ||
    !endTime
  ) {
    throw new apiError(
      400,
      "All fields (gameType, multipliers[], startTime, endTime) are required"
    );
  }

  const updatedRound = await GameRound.findByIdAndUpdate(
    id,
    {
      gameType,
      multipliers,
      startTime,
      endTime,
      status,
      period,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedRound) {
    throw new apiError(404, "Game round not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedRound, "Game round updated successfully"));
});

export { setgameround, getAllGameRounds, deleteGameRound, updateGameRound };
