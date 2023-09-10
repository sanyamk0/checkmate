import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
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
    const passedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    );
    if (passedPosition.samePosition(desiredPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
        return true;
      }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }
  return false;
};
export const getPossibleQueenMoves = (
  queen: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  //Top Right Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      queen.position.x + i,
      queen.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Right Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      queen.position.x + i,
      queen.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Top Left Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      queen.position.x - i,
      queen.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Left Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      queen.position.x - i,
      queen.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Top Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(queen.position.x, queen.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Right Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(queen.position.x + i, queen.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(queen.position.x, queen.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Left Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(queen.position.x - i, queen.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  return possibleMoves;
};
