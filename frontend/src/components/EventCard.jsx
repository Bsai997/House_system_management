import { formatDate, getStatusColor } from '../utils/constants';

const EventCard = ({ event, actions, showPoster = true }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {showPoster && event.poster && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.poster}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
        </div>
        <p className="text-sm font-bold text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#B89230"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg></span>
            <span className="font-bold">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0000F5"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-188.5-11.5Q280-423 280-440t11.5-28.5Q303-480 320-480t28.5 11.5Q360-457 360-440t-11.5 28.5Q337-400 320-400t-28.5-11.5ZM640-400q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-188.5-11.5Q280-263 280-280t11.5-28.5Q303-320 320-320t28.5 11.5Q360-297 360-280t-11.5 28.5Q337-240 320-240t-28.5-11.5ZM640-240q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg></span>
            <span className="font-bold">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F9DB78"><path d="M536.5-543.5Q560-567 560-600t-23.5-56.5Q513-680 480-680t-56.5 23.5Q400-633 400-600t23.5 56.5Q447-520 480-520t56.5-23.5ZM280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z"/></svg></span>
            <span className="font-bold">{event.housePoints} points</span>
          </div>
          {event.houseId && (
            <div className="flex items-center gap-2">
              <span className="font-bold"> Conducted by : </span>
              <span className="font-bold"> {event.houseId.name || event.houseId} House</span>
            </div>
          )}

        </div>
        {actions && <div className="mt-4 flex gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};

export default EventCard;
