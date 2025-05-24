// Import types are removed since JS has no types
// Assuming PropertyType is available as a plain JS object for this example
const PropertyType = {
  MONITOR: 'monitor',
  KEYBOARD: 'keyboard',
  MOUSE: 'mouse',
  FAN: 'fan',
  LIGHT: 'light',
  WIFI_ROUTER: 'wifi-router',
  AC: 'ac'
};

// Generate random property
const generateProperty = (type, id) => {
  const brands = {
    'monitor': ['Dell', 'HP', 'LG', 'Samsung', 'Acer'],
    'keyboard': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'HyperX'],
    'mouse': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'HyperX'],
    'fan': ['Havells', 'Usha', 'Orient', 'Crompton', 'Bajaj'],
    'light': ['Philips', 'Havells', 'Syska', 'Wipro', 'Osram'],
    'wifi-router': ['TP-Link', 'Netgear', 'Cisco', 'D-Link', 'Asus'],
    'ac': ['LG', 'Samsung', 'Voltas', 'Blue Star', 'Daikin'],
  };

  const models = {
    'monitor': ['P2419H', 'V24', 'UltraGear', 'Odyssey G5', 'Nitro'],
    'keyboard': ['K120', 'Wireless 900', 'K55', 'BlackWidow', 'Alloy Core'],
    'mouse': ['M185', 'Wireless 1850', 'Harpoon', 'DeathAdder', 'Pulsefire'],
    'fan': ['Swing', 'Aerostorm', 'Airflow', 'Aura', 'Midea'],
    'light': ['TrueValue', 'LED Pro', 'Smart Bulb', 'Garnet', 'LEDTube'],
    'wifi-router': ['Archer C6', 'Nighthawk', 'Linksys E5600', 'DIR-815', 'RT-AC53'],
    'ac': ['Dual Inverter', 'WindFree', 'Fresh Air', 'Inverter 5 Star', 'Room AC'],
  };

  const brandList = brands[type];
  const modelList = models[type];

  const brand = brandList[Math.floor(Math.random() * brandList.length)];
  const model = modelList[Math.floor(Math.random() * modelList.length)];
  const status = Math.random() > 0.2 ? 'working' : 'not_working';
  
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const purchaseDate = new Date(
    fiveYearsAgo.getTime() + Math.random() * (today.getTime() - fiveYearsAgo.getTime())
  ).toISOString().split('T')[0];

  return {
    id,
    type,
    brand,
    model,
    status,
    purchaseDate,
    notes: Math.random() > 0.7 ? `Maintenance performed on ${new Date().toLocaleDateString()}` : undefined,
  };
};

// Generate room with properties
const generateRoom = (floorId, hallId, roomId, roomName) => {
  const propertyTypes = Object.values(PropertyType);
  const properties = [];

  // Define property types for corridors (e.g., only lights and fans)
  const corridorPropertyTypes = ['light', 'fan'];

  if (roomName.toLowerCase() === "corridor") {
    // Generate only specific properties for corridors
    corridorPropertyTypes.forEach((type) => {
      const count = Math.floor(Math.random() * 4); // 0 to 3 properties per type
      for (let i = 0; i < count; i++) {
        properties.push(
          generateProperty(
            type,
            `${floorId}-${hallId}-${roomId}-${type}-${i}`
          )
        );
      }
    });
  } else {
    // Generate properties for all other rooms
    propertyTypes.forEach((type) => {
      const count = Math.floor(Math.random() * 4); // 0 to 3 properties per type
      for (let i = 0; i < count; i++) {
        properties.push(
          generateProperty(
            type,
            `${floorId}-${hallId}-${roomId}-${type}-${i}`
          )
        );
      }
    });
  }

  return {
    id: roomId,
    name: roomName,
    properties,
  };
};

// Generate hall with rooms
const generateHall = (floorId, hallId, hallName, roomNames) => {
  const rooms = roomNames.map((roomName, index) => 
    generateRoom(floorId, hallId, index + 1, roomName)
  );

  return {
    id: hallId,
    name: hallName,
    rooms,
  };
};

// Generate floor with custom halls and rooms
const generateFloor = (floorId) => {
  const halls = [];

  if (floorId === 2) {
    // 2nd Floor: Left Wing (Hall 1), Center (Corridor), Right Wing (Hall 2)
    halls.push(generateHall(floorId, 1, "Left Wing", ["Hall 1"])); // Hall 1
    halls.push(generateHall(floorId, 2, "Corridor", ["Front Side", "Back Side"])); // Corridor
    halls.push(generateHall(floorId, 3, "Right Wing", ["Hall 2"])); // Hall 2
  } else if (floorId === 3) {
    // 3rd Floor: Left Wing (Bays), Center (Outdoor), Right Wing (Office)
    halls.push(generateHall(floorId, 1, "Left Wing", ["Bay 1", "Bay 2", "Bay 3", "Bay 4", "Bay 5"])); // Bays
    halls.push(generateHall(floorId, 2, "Corridor", ["Front Side", "Back Side"])); // Outdoor
    halls.push(generateHall(floorId, 3, "Right Wing", ["Work Place", "Conference Hall", "CEO Cabin", "Panel 1", "Panel 2", "IOT Lab"])); // Office
  } else if (floorId === 4) {
    // 4th Floor: Left Wing (Hall 2), Center (Corridor), Right Wing (Hall 1)
    halls.push(generateHall(floorId, 1, "Left Wing", ["Hall 2"])); // Hall 2
    halls.push(generateHall(floorId, 2, "Corridor",["Front Side", "Back Side"])); // Corridor
    halls.push(generateHall(floorId, 3, "Right Wing", ["Hall 1"])); // Hall 1
  } else if (floorId === 5) {
    // 5th Floor: Left Wing (Bay 1), Center (Corridor), Right Wing (Bay 2, Server Room)
    halls.push(generateHall(floorId, 1, "Left Wing", ["Bay 1"])); // Bay 1
    halls.push(generateHall(floorId, 2, "Corridor", ["Front Side", "Back Side"])); // Corridor
    halls.push(generateHall(floorId, 3, "Right Wing", ["Bay 2", "Server Room"])); // Bay 2, Server Room
  }

  return {
    id: floorId,
    name: `Floor ${floorId}`,
    halls,
  };
};

// Generate building
const generateBuilding = () => {
  const floors = [];
  for (let i = 2; i <= 5; i++) {
    floors.push(generateFloor(i));
  }

  return { floors };
};

export const buildingData = generateBuilding();

// Sample user data
export const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    password: 'user123',
  },
];