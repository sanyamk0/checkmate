import { useRef, useState } from "react"
import { initialBoard } from "../Constants";
import Chessboard from "./Chessboard";
import { Piece, Position } from "../models";
import { PieceType, TeamType } from "../Types";
import { Pawn } from "../models/Pawn";
import { Board } from "../models/Board";


export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>()
    const modalRef = useRef<HTMLDivElement>(null)
    const checkmateModalRef = useRef<HTMLDivElement>(null)
    const mover = board.totalTurns % 2 === 0 ? "White" : "Black";

    function playMove(playedPiece: Piece, destination: Position): boolean {
        //If Playing Piece doesn't have any moves return
        if (playedPiece.possibleMoves === undefined) {
            return false;
        }
        //Preventing Inactive Team from Playing
        if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 0) {
            return false;
        }
        if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 1) {
            return false;
        }
        let playedMoveIsValid = false;
        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));
        if (!validMove) {
            return false;
        }
        const enPassantMove = isEnPassantmove(playedPiece.position, destination, playedPiece.type, playedPiece.team)
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);
            if (clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
            }
            return clonedBoard;
        })
        const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(() => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
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
    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) { return; }
        setBoard(() => {
            const clonedBoard = board.clone()
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true))
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])
            clonedBoard.calculateAllMoves()
            return clonedBoard;
        })
        modalRef.current?.classList.add("hidden")
    }
    function promotionTeamType() {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }
    function restartGame() {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
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
            <div className="absolute top-0 right-0 bottom-0 left-0 hidden" ref={checkmateModalRef}>
                <div className="flex justify-around items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-60 w-[640px] bg-[rgba(127,127,127,0.7)]">
                    <div className="flex flex-col gap-12">
                        <span className="text-3xl">{board.winningTeam === TeamType.OUR ? "White" : "Black"} Team Won!!</span>
                        <button onClick={restartGame} className="bg-[#779556] text-white p-6 text-3xl border-none rounded-lg hover:cursor-pointer">Play Again</button>
                    </div>
                </div>
            </div>
            <div className="flex bg-black gap-5">
                <p style={{ color: "white", fontSize: "24px" }}>Total Turns: {board.totalTurns}</p>
                <p style={{ color: "white", fontSize: "24px" }}>Turn: {mover}</p>
            </div>
            <Chessboard playMove={playMove} pieces={board.pieces} />
        </>
    )
}
