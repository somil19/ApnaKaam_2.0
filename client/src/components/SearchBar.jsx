import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex w-3/4 md:w-1/3 mt-4 items-center placeholder:items-start rounded-full bg-gradient-to-br from-blue-200 to-blue-100">
      {" "}
      <input
        className=" px-3 py-1 placeholder-gray-500 placeholder:text-sm w-full bg-gradient-to-br from-blue-200 to-blue-100 rounded-full outline-none focus:bg-gradient-to-br focus:from-blue-200"
        placeholder="Search your todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />{" "}
      {searchQuery ? (
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => setSearchQuery("")}
          className="mr-4 pl-2 cursor-pointer"
        />
      ) : (
        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-4 pl-2" />
      )}
    </div>
  );
};

export default SearchBar;
