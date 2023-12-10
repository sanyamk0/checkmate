import Referee from "../Referee/Referee";

interface GameProps {
  gameId: string;
}

const Game: React.FC<GameProps> = ({ gameId }) => {
  return (
    <div className="grid place-content-start pl-5 h-[100vh] bg-black">
      <Referee gameId={gameId} />
    </div>
  );
};

export default Game;
