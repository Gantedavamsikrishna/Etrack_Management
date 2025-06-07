const PropertyType = {
  MONITOR: 'monitor',
  KEYBOARD: 'keyboard',
  MOUSE: 'mouse',
  FAN: 'fan',
  LIGHT: 'light',
  WIFI_ROUTER: 'wifi-router',
  AC: 'ac'
};

let barcodeCounter = 101;

const generateBarcode = (brand) => {
  if (barcodeCounter > 200) {
    throw new Error('Exceeded maximum barcode limit of 200');
  }
  const barcode = `${brand}-${barcodeCounter}`;
  barcodeCounter++;
  return barcode;
};

const generateProperty = (type, id, location, status, brand, hallName, roomName) => {
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

  const selectedBrand = brand || brandList[Math.floor(Math.random() * brandList.length)];
  const model = modelList[Math.floor(Math.random() * modelList.length)];

  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const purchaseDate = new Date(
    fiveYearsAgo.getTime() + Math.random() * (today.getTime() - fiveYearsAgo.getTime())
  ).toISOString().split('T')[0];

  return {
    id,
    type,
    brand: selectedBrand,
    model,
    status,
    purchaseDate,
    barcode: generateBarcode(selectedBrand),
    location: `Floor ${location}, ${hallName}, ${roomName}`
  };
};

const generateRoom = (floorId, hallId, hallName, roomId, roomName, propertyTypes, propertiesPerRoom, statusAssignments) => {
  const properties = [];
  const availableTypes = roomName.toLowerCase().includes("corridor") ? ['light', 'fan'] : propertyTypes;
  
  for (let i = 0; i < propertiesPerRoom; i++) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const status = statusAssignments[i] || 'working';
    const brandIndex = Math.floor(Math.random() * 5);
    const brand = {
      'monitor': ['Dell', 'HP', 'LG', 'Samsung', 'Acer'],
      'keyboard': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'HyperX'],
      'mouse': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'HyperX'],
      'fan': ['Havells', 'Usha', 'Orient', 'Crompton', 'Bajaj'],
      'light': ['Philips', 'Havells', 'Syska', 'Wipro', 'Osram'],
      'wifi-router': ['TP-Link', 'Netgear', 'Cisco', 'D-Link', 'Asus'],
      'ac': ['LG', 'Samsung', 'Voltas', 'Blue Star', 'Daikin'],
    }[type][brandIndex];
    properties.push(
      generateProperty(
        type,
        `${floorId}-${hallId}-${roomId}-${type}-${i}`,
        floorId,
        status,
        brand,
        hallName,
        roomName
      )
    );
  }

  return {
    id: roomId,
    name: roomName,
    properties,
    usedProperties: properties.length
  };
};

const generateHall = (floorId, hallId, hallName, roomNames, propertiesPerRoom, propertyTypes, statusAssignments) => {
  let usedProperties = 0;
  const rooms = roomNames.map((roomName, index) => {
    const room = generateRoom(floorId, hallId, hallName, index + 1, roomName, propertyTypes, propertiesPerRoom, statusAssignments);
    usedProperties += room.usedProperties;
    return {
      id: room.id,
      name: room.name,
      properties: room.properties
    };
  });

  return {
    id: hallId,
    name: hallName,
    rooms,
    usedProperties
  };
};

const generateFloor = (floorId) => {
  const propertyTypes = Object.values(PropertyType);
  const halls = [];

  if (floorId === 3) {
    const propertiesPerRoom = 3;
    const totalProperties = (2 + 5 + 6) * propertiesPerRoom; // 13 rooms * 3 = 39 properties
    const statusAssignments = Array(Math.ceil(totalProperties * 0.8)).fill('working')
      .concat(Array(Math.floor(totalProperties * 0.2)).fill('not_working'))
      .sort(() => Math.random() - 0.5);

    const hallConfigs = [
      {
        id: 1,
        name: "Corridor",
        rooms: ["Front Side", "Back Side"],
        propertiesPerRoom
      },
      {
        id: 2,
        name: "Left Wing",
        rooms: ["Bay 1", "Bay 2", "Bay 3", "Bay 4", "Bay 5"],
        propertiesPerRoom
      },
      {
        id: 3,
        name: "Right Wing",
        rooms: ["Work Place", "Conference Hall", "CEO Cabin", "Panel 1", "Panel 2", "IOT Lab"],
        propertiesPerRoom
      }
    ];

    let statusIndex = 0;
    for (const config of hallConfigs) {
      const hallStatusAssignments = statusAssignments.slice(statusIndex, statusIndex + (config.rooms.length * propertiesPerRoom));
      statusIndex += config.rooms.length * propertiesPerRoom;
      const hall = generateHall(
        floorId,
        config.id,
        config.name,
        config.rooms,
        config.propertiesPerRoom,
        propertyTypes,
        hallStatusAssignments
      );
      halls.push(hall);
    }
  } else {
    const maxProperties = 10;
    let usedProperties = 0;
    const statusAssignments = Array(8).fill('working').concat(Array(2).fill('not_working')).sort(() => Math.random() - 0.5);

    let hallConfigs;
    if (floorId === 2) {
      hallConfigs = [
        { id: 1, name: "Left Wing", rooms: ["Hall 1"], targetProperties: 4 },
        { id: 2, name: "Corridor", rooms: ["Front Side", "Back Side"], targetProperties: 2 },
        { id: 3, name: "Right Wing", rooms: ["Hall 2"], targetProperties: 4 }
      ];
    } else if (floorId === 4) {
      hallConfigs = [
        { id: 1, name: "Left Wing", rooms: ["Hall 2"], targetProperties: 4 },
        { id: 2, name: "Corridor", rooms: ["Front Side", "Back Side"], targetProperties: 2 },
        { id: 3, name: "Right Wing", rooms: ["Hall 1"], targetProperties: 4 }
      ];
    } else if (floorId === 5) {
      hallConfigs = [
        { id: 1, name: "Left Wing", rooms: ["Bay 1"], targetProperties: 4 },
        { id: 2, name: "Corridor", rooms: ["Front Side", "Back Side"], targetProperties: 2 },
        { id: 3, name: "Right Wing", rooms: ["Bay 2", "Server Room"], targetProperties: 4 }
      ];
    }

    for (const config of hallConfigs) {
      const remainingProperties = maxProperties - usedProperties;
      const targetProperties = Math.min(config.targetProperties, remainingProperties);
      if (targetProperties <= 0) continue;

      const hall = generateHall(
        floorId,
        config.id,
        config.name,
        config.rooms,
        targetProperties,
        propertyTypes,
        statusAssignments.slice(usedProperties, usedProperties + targetProperties)
      );
      usedProperties += hall.usedProperties;
      halls.push(hall);
    }
  }

  return {
    id: floorId,
    name: `Floor ${floorId}`,
    halls
  };
};

const generateBuilding = () => {
  const floors = [];
  barcodeCounter = 101;
  for (let i = 2; i <= 5; i++) {
    floors.push(generateFloor(i));
  }

  const totalDevices = floors.reduce((acc, floor) => {
    const floorDevices = floor.halls.reduce((hallAcc, hall) => {
      return hallAcc + hall.rooms.reduce((roomAcc, room) => roomAcc + room.properties.length, 0);
    }, 0);
    return acc + floorDevices;
  }, 0);

  if (totalDevices !== 69) {
    console.warn(`Generated ${totalDevices} devices instead of 69. Please check configuration.`);
  }

  return { floors };
};

export const buildingData = generateBuilding();

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