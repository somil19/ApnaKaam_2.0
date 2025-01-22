/* eslint-disable react/prop-types */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TaskSummary({ todo, setShowSummary }) {
  console.log(todo);
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white w-80 max-w-md rounded-lg shadow-lg p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setShowSummary(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {/* Modal Content */}
          <h2 className="text-lg font-semibold text-indigo-600 mb-4 border-b border-indigo-100 text-center">
            Your Task Summary
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Title:</strong> {todo.title}
            </li>
            <li>
              <strong>Description:</strong> {todo.notes || "none"}
            </li>

            <li>
              <strong>Status:</strong>{" "}
              {todo.completed ? "Completed" : "Pending"}
            </li>
            <li>
              <strong>Created At:</strong> {todo.todoAddedAt}
            </li>
            <li>
              <strong>Last Updated At:</strong> {todo.todoUpdatedAt}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
