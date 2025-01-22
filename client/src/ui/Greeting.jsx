import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 20) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
}
const motivationalThoughts = [
  "Every accomplishment starts with the decision to try.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "This is Your private space",
  "What will Accomplish Today?",
  "Lets make an impact",
  "Time to make your own mark on the world",
  "Your limitation—it's only your imagination.",
  "Tomorrow: a chance to conquer new horizons.",
  "Dream it. Wish it. Do it.",
];

export default function Greeting() {
  const greeting = getGreeting();

  const randomThought =
    motivationalThoughts[
      Math.floor(Math.random() * motivationalThoughts.length)
    ];
  const userName = useSelector((state) => state.signUp.userName);
  return (
    <div className="flex flex-col py-6 text-center   ">
      {" "}
      <h1 className="text-xl lg:text-4xl capitalize font-bold text-blue-900">
        {" "}
        {greeting},<span className="ml-2">{userName}</span>
        <FontAwesomeIcon
          icon={faCircle}
          className="text-indigo-600 ml-2 h-3  md:h-5"
        />{" "}
      </h1>{" "}
      <p className="text-sm md:text-md leading-relaxed  italic  mt-2 ">
        {randomThought}
      </p>{" "}
    </div>
  );
}
