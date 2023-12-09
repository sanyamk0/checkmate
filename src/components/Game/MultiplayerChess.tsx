import Game from "./Game";

const MultiplayerChess = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 bg-gray-200 mr-4">
                <Game />
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
