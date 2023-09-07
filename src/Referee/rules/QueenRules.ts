import { Piece, Position, TeamType, samePosition } from "../../Constants";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
} from "./GeneralRules";

export const queenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    const multiplierX =
      desiredPosition.x < initialPosition.x
        ? -1
        : desiredPosition.x > initialPosition.x
        ? 1
        : 0;
    const multiplierY =
      desiredPosition.y < initialPosition.y
        ? -1
        : desiredPosition.y > initialPosition.y
        ? 1
        : 0;
    const paassedPosition: Position = {
      x: initialPosition.x + i * multiplierX,
      y: initialPosition.y + i * multiplierY,
    };
    if (samePosition(paassedPosition, desiredPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(paassedPosition, boardState, team)) {
        return true;
      }
    } else {
      if (tileIsOccupied(paassedPosition, boardState)) {
        break;
      }
    }
  }
  return false;
};
