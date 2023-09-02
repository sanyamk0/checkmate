import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import Referee from "../../Referee/Referee";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position, samePosition } from "../../Constants";

const Chessboard = () => {
    const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 })
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null)
    const referee = new Referee();

    function grabPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
            setGrabPosition({ x: grabX, y: grabY })
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element)
        }
    }
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            //Putting Constraints so that Piece do not Go Outside Chessboard
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }
            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }
    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
            const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));
            if (currentPiece) {
                const validMove = referee.isValidMove(grabPosition, { x, y }, currentPiece.type, currentPiece.team, pieces)
                const isEnPassantMove = referee.isEnPassantmove(grabPosition, { x, y }, currentPiece.type, currentPiece.team, pieces)
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;
                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, { x, y: y - pawnDirection }))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece)
                        }
                        return results;
                    }, [] as Piece[])
                    setPieces(updatedPieces);
                }
                else if (validMove) {
                    //Updates Piece Position and if a Piece is Attacked Removes It
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, { x, y }))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece)
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(updatedPieces);
                } else {
                    //Reset Piece Position
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }
    }
    const board = [];
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, { x: i, y: j }))
            const image = piece ? piece.image : undefined;
            board.push(<Tile key={`${i}${j}`} image={image} number={number} />)
        }
    }
    return (
        <div
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={e => grabPiece(e)}
            onMouseUp={(e) => dropPiece(e)}
            className="lg:h-[640px] lg:w-[640px] sm:w-[480px] sm:h-[480px] grid grid-cols-8 grid-rows-[8]"
            ref={chessboardRef}
        >
            {board}
        </div>
    )
}

export default Chessboard
