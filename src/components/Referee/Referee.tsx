import { useEffect, useRef, useState } from "react"
import { initialBoard } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../Referee/rules";
import { Piece, Position } from "../../models";
import { PieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Board } from "../../models/Board";

export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>()
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        updatePossibleMoves();
    }, [])

    function updatePossibleMoves() {
        board.calculateAllMoves();
    }
    function playMove(playedPiece: Piece, destination: Position): boolean {
        let playedMoveIsValid = false;
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team)
        const enPassantMove = isEnPassantmove(playedPiece.position, destination, playedPiece.type, playedPiece.team)
        setBoard((previousBoard) => {
            playedMoveIsValid = board.playMove(enPassantMove, validMove, playedPiece, destination);
            return board.clone();
        })
        const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(playedPiece);
        }
        return playedMoveIsValid;
    }
    function isEnPassantmove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType,
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board.pieces.find(
                    (p) =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn && (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }
    function isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType,
    ) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
                break;
            case PieceType.ROOK:
                validMove = rookMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
                break;
            case PieceType.QUEEN:
                validMove = queenMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
                break;
            case PieceType.KING:
                validMove = kingMove(
                    initialPosition,
                    desiredPosition,
                    team,
                    board.pieces
                );
        }
        return validMove;
    }
    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) { return; }
        board.pieces = board.pieces.reduce((results, piece) => {
            if (piece.samePiecePosition(promotionPawn)) {
                piece.type = pieceType;
                const teamType = (piece.team === TeamType.OUR) ? "w" : "b";
                let image = "";
                switch (pieceType) {
                    case PieceType.ROOK:
                        image = "rook"
                        break;
                    case PieceType.BISHOP:
                        image = "bishop"
                        break;
                    case PieceType.KNIGHT:
                        image = "knight"
                        break;
                    case PieceType.QUEEN:
                        image = "queen"
                        break;
                }
                piece.image = `assets/images/${image}_${teamType}.png`
            }
            results.push(piece);
            return results;
        }, [] as Piece[])
        updatePossibleMoves();
        modalRef.current?.classList.add("hidden")
    }
    function promotionTeamType() {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }
    return (
        <>
            <div className="absolute top-0 right-0 bottom-0 left-0 hidden" ref={modalRef}>
                <div className="flex justify-around items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-60 w-[640px] bg-[rgba(127,127,127,0.7)]">
                    <img onClick={() => promotePawn(PieceType.ROOK)} className="h-[120px] hover:cursor-pointer hover:bg-[rgba(255,255,255,0.3)] rounded-full p-5" src={`assets/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} className="h-[120px] hover:cursor-pointer hover:bg-[rgba(255,255,255,0.3)] rounded-full p-5" src={`assets/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} className="h-[120px] hover:cursor-pointer hover:bg-[rgba(255,255,255,0.3)] rounded-full p-5" src={`assets/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} className="h-[120px] hover:cursor-pointer hover:bg-[rgba(255,255,255,0.3)] rounded-full p-5" src={`assets/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <Chessboard playMove={playMove} pieces={board.pieces} />
        </>
    )
}