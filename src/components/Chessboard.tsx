const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const Chessboard = () => {
    const board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            if (number % 2 === 0) {
                board.push(<div key={`${horizontalAxis[i]}${verticalAxis[j]}`} className="bg-[#779556] lg:h-[80px] lg:w-[80px] sm:h-[60px] sm:w-[60px]"></div>)
            } else {
                board.push(<div key={`${horizontalAxis[i]}${verticalAxis[j]}`} className="bg-[#ebecd0] lg:h-[80px] lg:w-[80px] sm:h-[60px] sm:w-[60px]"></div>)
            }
        }
    }
    return (
        <div className="lg:h-[640px] lg:w-[640px] sm:w-[480px] sm:h-[480px] grid grid-cols-8 grid-rows-[8]">
            {board}
        </div>
    )
}

export default Chessboard
