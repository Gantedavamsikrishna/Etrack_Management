import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PropertyList } from "../components/property/PropertyList";
import { StatusChart } from "../components/charts/StatusChart";
import { PropertyTypeChart } from "../components/charts/PropertyTypeChart";
import { useAuth } from "../context/AuthContext";
import WifiLoader from "../utils/Loader.jsx";

export const Room = () => {
  const { floorId, hallId, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFloors = async () => {
      try {
        const response = await fetch(
          "https://etrack-backend.onrender.com/floor/getAllFloors",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          const mappedFloors = data.map((floor) => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(),
              name: wing.wingName,
              rooms: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(),
                name: room.roomName,
                properties: (room.devices || []).flatMap((device) =>
                  Array(device.count || 1)
                    .fill()
                    .map(() => ({
                      id: `${device.deviceName}-${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                      type: device.deviceName.toLowerCase().includes("monitor")
                        ? "monitor"
                        : device.deviceName.toLowerCase().includes("mouse")
                        ? "mouse"
                        : device.deviceName.toLowerCase().includes("fan")
                        ? "fan"
                        : device.deviceName.toLowerCase().includes("ac")
                        ? "ac"
                        : device.deviceName.toLowerCase().includes("keyboard")
                        ? "keyboard"
                        : device.deviceName.toLowerCase().includes("light")
                        ? "light"
                        : device.deviceName
                            .toLowerCase()
                            .includes("wifi-router")
                        ? "wifi-router"
                        : "unknown",
                      brand: device.deviceName.split(" ")[0] || "Unknown",
                      model: device.deviceModel || "Unknown",
                      status:
                        device.deviceStatus === "working"
                          ? "working"
                          : "not_working",
                    }))
                ),
              })),
            })),
          }));

          setFloors(mappedFloors);
        } else {
          console.error("Failed to fetch floors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchFloors();
  }, [user, navigate]);

  // ✅ Show loader while fetching data
  if (loading) {
    return (
      <div className="h-[700px] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <WifiLoader className="scale-[2.5]" />
        <p
          className="text-gray-700 dark:text-gray-200 text-xl font-semibold mt-6"
          style={{ color: "red" }}
        >
          Dey Adukku thinevada Agara kasepu data vasthundhi....
        </p>
      </div>
    );
  }

  // ✅ Room lookup after loading
  const floor = floors.find((f) => f.id === parseInt(floorId));
  const hall = floor?.halls?.find((h) => h.id === parseInt(hallId).toString());
  const room = hall?.rooms?.find((r) => r.id === parseInt(roomId).toString());

  if (!floor || !hall || !room) {
    return (
      <div className="h-[700px] w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <WifiLoader className="scale-[2]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm font-medium">
        <Link
          to="/"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link
          to={`/floors/${floor.id}`}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {floor.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link
          to={`/floors/${floor.id}/halls/${hall.id}`}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {hall.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 dark:text-white">{room.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {floor.name} {hall.name} {room.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View properties in this room
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Properties
          </p>
          <p className="text-xl font-semibold mt-1">
            {room.properties?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
          <p className="text-xl font-semibold mt-1 text-success-600 dark:text-success-400">
            {room.properties?.filter((p) => p.status === "working").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Not Working
          </p>
          <p className="text-xl font-semibold mt-1 text-error-600 dark:text-error-400">
            {room.properties?.filter((p) => p.status === "not_working")
              .length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Types of Equipment
          </p>
          <p className="text-xl font-semibold mt-1">
            {room.properties
              ? new Set(room.properties.map((p) => p.type)).size
              : 0}
          </p>
        </div>
      </div>

      {room.properties?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart properties={room.properties} />
          <PropertyTypeChart properties={room.properties} />
        </div>
      )}

      <PropertyList
        properties={room.properties || []}
        title={`Properties in ${room.name}`}
        enableEdit={false}
      />
    </div>
  );
};
