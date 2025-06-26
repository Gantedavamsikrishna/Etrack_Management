
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, DoorOpen } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { PropertyList } from "../components/property/PropertyList";
import { StatusChart } from "../components/charts/StatusChart";
import { PropertyTypeChart } from "../components/charts/PropertyTypeChart";
import { useAuth } from "../context/AuthContext";
import WifiLoader from "../utils/Loader";

export const Hall = () => {
  const { floorId, hallId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBayId, setSelectedBayId] = useState(null);

  useEffect(() => {
    if (!user) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchFloors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://etrack-backend.onrender.com/floor/getAllFloors",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        console.log("API Response:", data);
        if (response.ok) {
          const mappedFloors = data.map((floor) => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(),
              name: wing.wingName,
              bays: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(),
                name: room.roomName,
                properties: (room.devices || []).flatMap((device) =>
                  Array(device.count || 1).fill().map((_, deviceIndex) => ({
                    id: device.deviceBarcode || `${device.deviceName}-${Math.random().toString(36).substr(2, 9)}`,
                    name: device.deviceName,
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
                      : device.deviceName.toLowerCase().includes("wifi-router")
                      ? "wifi-router"
                      : "unknown",
                    brand: device.deviceName.split(" ")[0] || "Unknown",
                    model: device.deviceModel || "Unknown",
                    status:
                      device.deviceStatus.toLowerCase() === "working"
                        ? "working"
                        : "not_working",
                    price: device.devicePrice || 0,
                    floorName: floor.floorName || "Unknown",
                    wingName: wing.wingName || "Unknown",
                    bayName: room.roomName || "Unknown",
                    deviceLocation: `${floor.floorName || "Unknown"}/${
                      wing.wingName || "Unknown"
                    }/${room.roomName || "Unknown"}`,
                    purchaseDate: device.createdAt?.split("T")[0] || "",
                  }))
                ),
              })),
            })),
          }));
          console.log("Mapped Floors:", mappedFloors);
          setFloors(mappedFloors);
        } else {
          console.error("Failed to fetch floors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloors();
  }, [user, navigate]);

  const floor = floors.find((f) => f.id === parseInt(floorId));
  const hall = floor?.halls.find((h) => h.id === hallId);
  const isCorridor = hall?.name === "Corridor" || hall?.name === "Center" || hall?.name === "Outdoor";
  const selectedBay = selectedBayId ? hall?.bays.find((b) => b.id === selectedBayId) : null;

  if (loading || !floor || !hall) {
    console.log("Hall not found:", {
      floorExists: !!floor,
      hallExists: !!hall,
      loading,
    });
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="h-[520px] w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <WifiLoader className="scale-[2]" />
        </div>
      </div>
    );
  }

  const handleBayClick = (bayId) => {
    setSelectedBayId(bayId === selectedBayId ? null : bayId); // Toggle selection
  };

  const handleClearSelection = () => {
    setSelectedBayId(null);
  };

  // Stats properties (dynamic based on selected bay/room or wing/Corridor)
  const statsProperties = selectedBay
    ? selectedBay.properties
    : hall.bays.flatMap((bay) => bay.properties);
  const totalStatsProperties = statsProperties.length;
  const workingStatsProperties = statsProperties.filter((p) => p.status === "working").length;
  const notWorkingStatsProperties = statsProperties.filter((p) => p.status === "not_working").length;
  const totalBaysOrRooms = selectedBay ? 1 : hall.bays.length;

  // Overall properties for charts (all bays)
  const overallChartProperties = hall.bays.flatMap((bay) => bay.properties);

  // Selected bay properties for charts (only selected bay)
  const selectedBayChartProperties = selectedBay ? selectedBay.properties : [];

  // Properties for PropertyList (dynamic based on selected bay/room or wing/Corridor)
  const listProperties = selectedBay
    ? selectedBay.properties
    : hall.bays.flatMap((bay) => bay.properties);

  return (
    <div className="space-y-6 p-6">
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
        {selectedBay ? (
          <>
            <button
              onClick={handleClearSelection}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {hall.name}
            </button>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{selectedBay.name}</span>
          </>
        ) : (
          <span className="text-gray-900 dark:text-white">{hall.name}</span>
        )}
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {floor.name}/{hall.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview and management of all {isCorridor ? "rooms" : "bays"} in this {isCorridor ? "hall" : "wing"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isCorridor ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
            <p className="text-xl font-semibold mt-1">{totalBaysOrRooms}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Bays</p>
            <p className="text-xl font-semibold mt-1">{totalBaysOrRooms}</p>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
          <p className="text-xl font-semibold mt-1">{totalStatsProperties}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
          <p className="text-xl font-semibold mt-1 text-success-600 dark:text-success-400">
            {workingStatsProperties} (
            {totalStatsProperties > 0 ? Math.round((workingStatsProperties / totalStatsProperties) * 100) : 0}%)
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Not Working</p>
          <p className="text-xl font-semibold mt-1 text-error-600 dark:text-error-400">
            {notWorkingStatsProperties} (
            {totalStatsProperties > 0 ? Math.round((notWorkingStatsProperties / totalStatsProperties) * 100) : 0}%)
          </p>
        </div>
      </div>

      {overallChartProperties.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Overall {isCorridor ? "Room" : "Bay"} Statistics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <StatusChart properties={overallChartProperties} />
            </div>
            <div className="lg:col-span-8">
              <PropertyTypeChart properties={overallChartProperties} />
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {isCorridor ? "Rooms" : "Bays"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hall.bays.map((bay) => {
            const bayProps = bay.properties;
            const working = bayProps.filter((p) => p.status === "working").length;
            const percentage = bayProps.length > 0 ? Math.round((working / bayProps.length) * 100) : 0;

            return (
              <Card
                key={bay.id}
                className={`overflow-hidden hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                  selectedBayId === bay.id ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => handleBayClick(bay.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="p-2 rounded-md bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 mr-3">
                        <DoorOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium">{bay.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Properties:</span>
                        <span className="font-medium">{bayProps.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedBay && selectedBayChartProperties.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Selected {isCorridor ? "Room" : "Bay"} Statistics: {selectedBay.name}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <StatusChart properties={selectedBayChartProperties} />
            </div>
            <div className="lg:col-span-8">
              <PropertyTypeChart properties={selectedBayChartProperties} />
            </div>
          </div>
        </div>
      )}

      {listProperties.length > 0 && (
        <PropertyList
          properties={listProperties}
          title={`All Properties in ${selectedBay ? selectedBay.name : hall.name}`}
          enableEdit={false}
        />
      )}
    </div>
  );
};