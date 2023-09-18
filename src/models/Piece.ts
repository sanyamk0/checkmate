import { Position } from ".";
import { PieceType, TeamType } from "../Types";

export class Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];
  hasMoved: boolean;
  constructor(
    position: Position,
    type: PieceType,
    team: TeamType,
    hasMoved: boolean,
    possibleMoves: Position[] = []
  ) {
    this.image = `assets/images/${type}_${team}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
    this.possibleMoves = possibleMoves;
    this.hasMoved = hasMoved;
  }
  get isPawn(): boolean {
    return this.type === PieceType.PAWN;
  }
  get isKnight(): boolean {
    return this.type === PieceType.KNIGHT;
  }
  get isBishop(): boolean {
    return this.type === PieceType.BISHOP;
  }
  get isRook(): boolean {
    return this.type === PieceType.ROOK;
  }
  get isQueen(): boolean {
    return this.type === PieceType.QUEEN;
  }
  get isKing(): boolean {
    return this.type === PieceType.KING;
  }
  samePiecePosition(otherPiece: Piece): boolean {
    return this.position.samePosition(otherPiece.position);
  }
  samePosition(otherPosition: Position): boolean {
    return this.position.samePosition(otherPosition);
  }
  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.hasMoved,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}
