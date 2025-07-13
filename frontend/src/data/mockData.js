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
const generateRoom = (floorId, hallId, roomId) => {
  const propertyTypes = Object.values(PropertyType);
  const properties = [];

  propertyTypes.forEach((type) => {
    const count = Math.floor(Math.random() * 4); // 0 to 3
    for (let i = 0; i < count; i++) {
      properties.push(
        generateProperty(
          type,
          `${floorId}-${hallId}-${roomId}-${type}-${i}`
        )
      );
    }
  });

  return {
    id: roomId,
    name: `Room ${roomId}`,
    properties,
  };
};

// Generate hall with rooms
const generateHall = (floorId, hallId) => {
  const rooms = [];
  for (let i = 1; i <= 3; i++) {
    rooms.push(generateRoom(floorId, hallId, i));
  }

  return {
    id: hallId,
    name: `Hall ${hallId}`,
    rooms,
  };
};

// Generate floor with halls
const generateFloor = (floorId) => {
  const halls = [];
  for (let i = 1; i <= 2; i++) {
    halls.push(generateHall(floorId, i));
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