import { useParams } from "react-router-dom";
import Game from "./Game";

const MultiplayerChess = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 bg-gray-200 mr-4">
                {id && <Game gameId={id} />}
            </div>
            <div className="col-span-1 grid grid-rows-2 gap-4">
                <div className="row-span-1 bg-gray-300 flex justify-center items-center">
                    Chat Section
                </div>
                <div className="row-span-1 bg-gray-300 flex justify-center items-center">
                    Video Call Section
                </div>
            </div>
        </div>
    );
};

export default MultiplayerChess;
