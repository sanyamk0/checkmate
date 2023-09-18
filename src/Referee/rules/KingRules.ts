import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 2; i++) {
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
    const paassedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    );
    if (paassedPosition.samePosition(desiredPosition)) {
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
export const getPossibleKingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  //Top Right Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Right Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Top Left Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Left Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Top Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y + i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Right Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Bottom Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y - i);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  //Left Preview
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y);
    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  return possibleMoves;
};
export const getCastlingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  if (king.hasMoved) return possibleMoves;
  //We get the rooks from the king's team which haven't moved
  const rooks = boardState.filter(
    (p) => p.isRook && p.team === king.team && !p.hasMoved
  );
  //Loop through the rooks
  for (const rook of rooks) {
    //Determine if we need to go to the right or left side
    const direction = rook.position.x - king.position.x > 0 ? 1 : -1;
    const adjacentPosition = king.position.clone();
    adjacentPosition.x += direction;
    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosition)))
      continue;
    //We know that the rook can move to the adjacent side of the king
    const concerningTiles = rook.possibleMoves.filter(
      (m) => m.y === king.position.y
    );
    //Checking if any of the enemy pieces can attack the spaces between the Rook and the King
    const enemyPieces = boardState.filter((p) => p.team !== king.team);
    let valid = true;
    for (const enemy of enemyPieces) {
      if (enemy.possibleMoves === undefined) continue;
      for (const move of enemy.possibleMoves) {
        if (concerningTiles.some((t) => t.samePosition(move))) {
          valid = false;
        }
        if (!valid) break;
      }
      if (!valid) break;
    }
    if (!valid) continue;
    // We now want to add it as a possible move
    possibleMoves.push(rook.position.clone());
  }
  return possibleMoves;
};
