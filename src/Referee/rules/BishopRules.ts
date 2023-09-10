import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    //Top Right Movement
    if (
      desiredPosition.x > initialPosition.x &&
      desiredPosition.y > initialPosition.y
    ) {
      const passedPosition = new Position(
        initialPosition.x + i,
        initialPosition.y + i
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
    //Bottom Right Movement
    if (
      desiredPosition.x > initialPosition.x &&
      desiredPosition.y < initialPosition.y
    ) {
      const passedPosition = new Position(
        initialPosition.x + i,
        initialPosition.y - i
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
    //Top Left Movement
    if (
      desiredPosition.x < initialPosition.x &&
      desiredPosition.y > initialPosition.y
    ) {
      const passedPosition = new Position(
        initialPosition.x - i,
        initialPosition.y + i
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
    //Bottom Left Movement
    if (
      desiredPosition.x < initialPosition.x &&
      desiredPosition.y < initialPosition.y
    ) {
      const passedPosition = new Position(
        initialPosition.x - i,
        initialPosition.y - i
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
  }
  return false;
};
export const getPossibleBishopMoves = (
  bishop: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  //Top Right Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      bishop.position.x + i,
      bishop.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Right Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      bishop.position.x + i,
      bishop.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Top Left Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      bishop.position.x - i,
      bishop.position.y + i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Left Preview
  for (let i = 1; i < 8; i++) {
    const destination = new Position(
      bishop.position.x - i,
      bishop.position.y - i
    );
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  return possibleMoves;
};
