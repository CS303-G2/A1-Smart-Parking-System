import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Background from "./Background";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import AlertDialog from "./AlertDialog";

function Bookslot() {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSlots = (token) => {
    axios
      .get("http://127.0.0.1:11172/lotsInfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.info;
        const groupedByLevel = {};

        data.forEach(([slot, status]) => {
          const level = slot.split("_")[0];
          if (!groupedByLevel[level]) {
            groupedByLevel[level] = [];
          }
          if (status === 0) {
            groupedByLevel[level].push(slot);
          }
        });

        setLevels(Object.keys(groupedByLevel));
        setAvailableSlots(groupedByLevel);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parking data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/sign-in");
    }
    fetchSlots(token);
  }, []);

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const formatSlot = (slot) => {
    console.log(slot);
    const [level, row, col] = slot.split("_");
    return `Level ${level}, Row ${row}, Column ${col}`;
  };

  return (
    <div className="h-screen  relative">
      <Navbar />
      <Background brightness={0.8} opacity={0.4} />
      <div className="p-6 mx-12 pt-28">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Book a Parking Slot
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-blue-600 w-12 h-12 rounded-full animate-spin"></div>
          </div>
        ) : levels.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between gap-5 items-center">
              <label
                htmlFor="level"
                className="text-nowrap text-lg font-medium mb-2 text-gray-800"
              >
                Choose Your Desired Level:
              </label>
              <select
                id="level"
                className="p-2 border rounded-lg shadow  focus:ring-2 focus:ring-blue-400"
                onChange={handleLevelChange}
              >
                <option value="">-- Select Level --</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    Level {level} (₹{12 - 2 * level}/hr)
                  </option>
                ))}
              </select>
            </div>

            {selectedLevel && availableSlots[selectedLevel] && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Available Slots for Level {selectedLevel}:
                </h2>
                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 100 }, (_, index) => {
                    // Determine the slot ID based on the grid position (assuming x_y_z format)
                    const row = Math.floor(index / 10) + 1;
                    const col = (index % 10) + 1;
                    const slot = `${selectedLevel}_${row}_${col}`;

                    // Check if the slot is available
                    const isAvailable =
                      availableSlots[selectedLevel]?.includes(slot);

                    return (
                      <div
                        key={index}
                        className={`w-10 h-10 border rounded-lg shadow cursor-pointer focus:outline-none transition ${
                          isAvailable
                            ? "bg-green-100 hover:bg-green-200 focus:ring-2 focus:ring-green-400" // Available slot (green)
                            : "bg-red-500" // Booked or unavailable slot (red)
                        }`}
                        title={
                          isAvailable
                            ? `Available: ${formatSlot(slot)}`
                            : `Booked: ${formatSlot(slot)}`
                        }
                      >
                        {isAvailable && (
                          <AlertDialog
                            slot={formatSlot(slot)}
                            query={slot}
                            key={index}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No parking data available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Bookslot;
