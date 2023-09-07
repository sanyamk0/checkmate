import "./Tile.css"
interface Props { image?: string; number: number; highlight: boolean; }

const Tile = ({ number, image, highlight }: Props) => {
    const className: string = ["tile",
        "lg:h-[80px]",
        "lg:w-[80px]",
        "sm:h-[60px]",
        "sm:w-[60px]",
        number % 2 === 0 && "black-tile",
        number % 2 !== 0 && "white-tile",
        highlight && "tile-highlight"].filter(Boolean).join(' ');
    return (
        <div className={className}>
            {image && <div className="chess-piece"
                style={{ backgroundImage: `url(${image})` }}></div>}
        </div >)
}

export default Tile
