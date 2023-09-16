import { Position } from "./Position";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { PieceType, TeamType } from "../Types";
import {
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
} from "../Referee/rules";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  constructor(pieces: Piece[], totalTurns: number) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
  }
  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
  }
  calculateAllMoves() {
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }
    //Check if King Moves are Valid
    this.checkingMoves();
    //Remove the Possible Moves for the Team that is Not Playing
    for (const piece of this.pieces.filter(
      (p) => p.team !== this.currentTeam
    )) {
      piece.possibleMoves = [];
    }
  }
  checkingMoves() {
    const king = this.pieces.find(
      (p) => p.isKing && p.team === this.currentTeam
    );
    if (king?.possibleMoves === undefined) {
      return;
    }
    for (const move of king.possibleMoves) {
      const simulatedBoard = this.clone();
      const pieceAtDestination = simulatedBoard.pieces.find((p) =>
        p.samePosition(move)
      );
      if (pieceAtDestination !== undefined) {
        simulatedBoard.pieces = simulatedBoard.pieces.filter(
          (p) => !p.samePosition(move)
        );
      }
      const simulatedKing = simulatedBoard.pieces.find(
        (p) => p.isKing && p.team === simulatedBoard.currentTeam
      );
      simulatedKing!.position = move;
      for (const enemy of simulatedBoard.pieces.filter(
        (p) => p.team !== simulatedBoard.currentTeam
      )) {
        enemy.possibleMoves = simulatedBoard.getValidMoves(
          enemy,
          simulatedBoard.pieces
        );
      }
      let safe = true;
      for (const p of simulatedBoard.pieces) {
        if (p.team === simulatedBoard.currentTeam) {
          continue;
        }
        if (p.isPawn) {
          const possiblePawnMoves = simulatedBoard.getValidMoves(
            p,
            simulatedBoard.pieces
          );
          if (
            possiblePawnMoves?.some(
              (ppm) => ppm.x !== p.position.x && ppm.samePosition(move)
            )
          ) {
            safe = false;
            break;
          }
        } else if (p.possibleMoves?.some((p) => p.samePosition(move))) {
          safe = false;
          break;
        }
      }
      if (!safe) {
        king.possibleMoves = king.possibleMoves?.filter(
          (m) => !m.samePosition(move)
        );
      }
    }
  }
  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }
  playMove(
    enPassantMove: boolean,
    validMove: boolean,
    playedPiece: Piece,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);
      this.calculateAllMoves();
    } else if (validMove) {
      //Updates Piece Position and if a Piece is Attacked Removes It
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 &&
              piece.type === PieceType.PAWN;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;

          results.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);
      this.calculateAllMoves();
    } else {
      return false;
    }
    return true;
  }
  clone(): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      this.totalTurns
    );
  }
}
