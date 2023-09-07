import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import Referee from "../../Referee/Referee";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position, samePosition } from "../../Constants";

const Chessboard = () => {
    const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 })
    const [promotionPawn, setPromotionPawn] = useState<Piece>()
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const referee = new Referee();

    function updateValidMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = referee.getValidMoves(p, currentPieces);
                return p;
            });
        })
    }
    function grabPiece(e: React.MouseEvent) {
        updateValidMoves();
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
                            const promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;
                            if (y === promotionRow && piece.type === PieceType.PAWN) {
                                modalRef.current?.classList.remove("hidden")
                                setPromotionPawn(piece);
                            }
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
    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) { return; }
        const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, promotionPawn.position)) {
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
                }
                piece.image = `assets/images/${image}_${teamType}.png`
            }
            results.push(piece);
            return results;
        }, [] as Piece[])
        setPieces(updatedPieces);
        modalRef.current?.classList.add("hidden")
    }
    function promotionTeamType() {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }
    const board = [];
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, { x: i, y: j }))
            const image = piece ? piece.image : undefined;
            const currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
            const highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, { x: i, y: j })) : false;
            board.push(<Tile key={`${i}${j}`} image={image} number={number} highlight={highlight} />)
        }
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
            <div
                onMouseMove={(e) => movePiece(e)}
                onMouseDown={e => grabPiece(e)}
                onMouseUp={(e) => dropPiece(e)}
                className="lg:h-[640px] lg:w-[640px] sm:w-[480px] sm:h-[480px] grid grid-cols-8 grid-rows-[8]"
                ref={chessboardRef}
            >
                {board}
            </div>
        </>
    )
}

export default Chessboard
