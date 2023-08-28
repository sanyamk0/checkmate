interface Props { image?: string, number: number }

const Tile = ({ number, image }: Props) => {
    if (number % 2 === 0) {
        return (
            <div className="bg-[#779556] lg:h-[80px] lg:w-[80px] sm:h-[60px] sm:w-[60px] grid place-content-center"><img src={image} className="w-[70px]" /></div>)
    } else {
        return (
            <div className="bg-[#ebecd0] lg:h-[80px] lg:w-[80px] sm:h-[60px] sm:w-[60px] grid place-content-center"><img src={image} className="w-[70px]" /></div>)
    }
}

export default Tile
