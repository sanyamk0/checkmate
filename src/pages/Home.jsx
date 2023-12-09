import { Link } from "react-router-dom";
import { AiFillHome, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BiSolidLogIn } from "react-icons/bi";
import { IoMdCreate } from "react-icons/io";

const Home = () => {
  const options = [
    { title: "Home", link: "/", icon: <AiFillHome /> },
    { title: "Create Game", link: "/create", icon: <IoMdCreate /> },
    { title: "Join Game", link: "/join-game", icon: <BsFillPersonPlusFill /> },
    { title: "Login", link: "/login", icon: <BiSolidLogIn /> },
  ];
  return (
    <>
      <div className="flex bg-gray-200">
        <div className="min-h-screen bg-gray-100 border-r w-56 shadow-lg">
          <div className="flex h-screen flex-col justify-between pt-2 pb-6">
            <div>
              <div className="mb-6 p-4">
                <img
                  src="/assets/images/checkmate.jpg"
                  alt="Checkmate"
                  className="w-24 mx-auto bg-transparent rounded-lg"
                />
              </div>
              <hr className="my-5 mx-5 rounded" />
              <div>
                <ul className="mt-6 space-y-2 tracking-wide">
                  {options.map((option) => (
                    <li key={option.title} className="min-w-max">
                      <Link
                        to={option.link}
                        className="relative flex items-center space-x-4 px-4 py-3"
                      >
                        {option.icon}
                        <span className="-mr-1 font-medium">
                          {option.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="my-5 mx-5 rounded" />
              <div className="flex items-center flex-col">
                <p className="mb-2">Developed By Sanyam Kumar</p>
                <div className="flex justify-center gap-10 p-4">
                  <Link to="https://github.com/sanyamk0">
                    <AiFillGithub className="h-7 w-7" />
                  </Link>
                  <Link to="https://www.linkedin.com/in/sanyamkumar002/">
                    <AiFillLinkedin className="h-7 w-7" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <img
            src="/assets/images/chessboard.png"
            alt="chessboard"
            className="h-96 w-96 my-32 mx-32 rounded"
          />
          <div className="flex flex-col justify-center">
            <p className="text-5xl font-semibold m-5">Play Chess Online</p>
            <div className="flex flex-col justify-center items-center gap-10 p-4">
              <Link to="/create">
                <button className="flex gap-2 items-center w-48 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg">
                  <IoMdCreate className="h-5 w-5" />
                  Create Game
                </button>
              </Link>
              <Link to="/join-game">
                <button className="flex gap-2 items-center w-48 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg">
                  <BsFillPersonPlusFill className="h-5 w-5" />
                  Join Game
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
