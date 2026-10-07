export const initialImpactMetrics = {
  mealsServed: "1,24,580",
  foodRescuedKg: "2,15,000 kg",
  eventsConnected: "3,950",
  partnerNgos: "1,280",
  activeVolunteers: "840",
};

export const initialDonations = [
  {
    id: "FC-1001",
    donorName: "Anand Banquet Hall",
    donorPhone: "+91 98765 11223",
    eventName: "Royal Wedding Reception",
    eventType: "Wedding",
    foodType: "North Indian Buffet",
    description: "Rich Dal Makhani, Paneer Butter Masala, Veg Biryani, Tandoori Roti & Gulab Jamun. Packed in food-grade insulated containers.",
    quantity: "150 meals",
    estimatedMeals: 150,
    preparationTime: "Freshly prepared 2.5 hours ago",
    pickupLocation: {
      address: "Anand Banquet Hall, 45 Grand Palace Road",
      city: "Mangalore",
      postalCode: "575001",
      coordinates: [74.8560, 12.9141]
    },
    pickupWindow: {
      from: "19:30",
      to: "22:30",
      date: "2026-10-04"
    },
    foodSafetyInfo: {
      temperatureMaintained: "Kept hot above 60°C",
      containerType: "Sealed Stainless Steel & Thermal Boxes",
      allergens: "Contains Dairy & Nuts"
    },
    status: "AVAILABLE", // DRAFT, AVAILABLE, ACCEPTED, PICKUP_ASSIGNED, PICKUP_IN_PROGRESS, PICKED_UP, DELIVERY_IN_PROGRESS, DELIVERED, COMPLETED, CANCELLED
    ngoId: null,
    ngoName: null,
    volunteerId: null,
    volunteerName: null,
    createdAt: "2026-10-04T14:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "FC-1002",
    donorName: "TechHub Conference Center",
    donorPhone: "+91 98450 99887",
    eventName: "Annual Innovation Summit 2026",
    eventType: "Corporate Event",
    foodType: "Assorted Lunch Boxes & Continental",
    description: "Packed Veg Thalis, Pasta Bowls, Salad Containers, and Fresh Fruit Platter. Prepared under strict hygiene guidelines.",
    quantity: "85 meals",
    estimatedMeals: 85,
    preparationTime: "Prepared 1.5 hours ago",
    pickupLocation: {
      address: "TechHub Tower, Cyber Park, Sector 4",
      city: "Mangalore",
      postalCode: "575003",
      coordinates: [74.8400, 12.8700]
    },
    pickupWindow: {
      from: "14:00",
      to: "17:00",
      date: "2026-10-04"
    },
    foodSafetyInfo: {
      temperatureMaintained: "Refrigerated cold salads, heated hot trays",
      containerType: "Eco-friendly biodegradable meal boxes",
      allergens: "Gluten free options available"
    },
    status: "ACCEPTED",
    ngoId: "NGO-101",
    ngoName: "Hope Shelter & Community Kitchen",
    ngoAddress: "14 Heritage Road, Mangalore",
    volunteerId: null,
    volunteerName: null,
    createdAt: "2026-10-04T12:30:00Z",
    acceptedAt: "2026-10-04T13:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "FC-1003",
    donorName: "Sunnyside Club House",
    donorPhone: "+91 97312 44556",
    eventName: "Golden Jubilee Family Gathering",
    eventType: "Private Party",
    foodType: "South Indian Traditional Feast",
    description: "Sambhar, Rasam, Vegetable Kurma, Steamed Rice, Sweet Payasam and Vadai. Cleanly stored in large warm urns.",
    quantity: "120 meals",
    estimatedMeals: 120,
    preparationTime: "Prepared 3 hours ago",
    pickupLocation: {
      address: "Sunnyside Club, Light House Hill",
      city: "Mangalore",
      postalCode: "575002",
      coordinates: [74.8430, 12.8730]
    },
    pickupWindow: {
      from: "20:00",
      to: "23:00",
      date: "2026-10-04"
    },
    foodSafetyInfo: {
      temperatureMaintained: "Thermal urns kept closed",
      containerType: "Stainless Steel Urns",
      allergens: "Vegetarian, Mustard seeds"
    },
    status: "PICKUP_IN_PROGRESS",
    ngoId: "NGO-102",
    ngoName: "Annapurna Food Trust",
    ngoAddress: "88 Central Community Hub, Mangalore",
    volunteerId: "VOL-101",
    volunteerName: "Rahul Sharma",
    volunteerPhone: "+91 98989 89898",
    createdAt: "2026-10-04T11:00:00Z",
    acceptedAt: "2026-10-04T11:45:00Z",
    pickupStartedAt: "2026-10-04T15:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1610057099443-f63a152d19eb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "FC-1004",
    donorName: "Greenwood International School",
    donorPhone: "+91 96112 33445",
    eventName: "Annual Sports Day Celebration",
    eventType: "School Event",
    foodType: "Puri Bhaji, Mixed Rice & Snacks",
    description: "Freshly cooked Puri Bhaji, Lemon Rice, Veg Cutlets, and Fresh Fruit Juice boxes.",
    quantity: "200 meals",
    estimatedMeals: 200,
    preparationTime: "Prepared yesterday",
    pickupLocation: {
      address: "Greenwood Campus, Kadri Road",
      city: "Mangalore",
      postalCode: "575004",
      coordinates: [74.8500, 12.8900]
    },
    pickupWindow: {
      from: "17:00",
      to: "20:00",
      date: "2026-10-03"
    },
    foodSafetyInfo: {
      temperatureMaintained: "Hygienically stored",
      containerType: "Bulk Carts & Foil Packs",
      allergens: "Wheat/Gluten"
    },
    status: "COMPLETED",
    ngoId: "NGO-103",
    ngoName: "Grace Care Home & Children Center",
    ngoAddress: "42 Meadow Lane, Mangalore",
    volunteerId: "VOL-102",
    volunteerName: "Priya Patel",
    volunteerPhone: "+91 97979 79797",
    createdAt: "2026-10-03T15:00:00Z",
    acceptedAt: "2026-10-03T15:30:00Z",
    pickedUpAt: "2026-10-03T17:45:00Z",
    deliveredAt: "2026-10-03T18:40:00Z",
    completedAt: "2026-10-03T19:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "FC-1005",
    donorName: "Kodialban Hotel & Lawns",
    donorPhone: "+91 99001 77665",
    eventName: "Silver Jubilee Anniversary Party",
    eventType: "Banquet",
    foodType: "Continental & Fusion Spread",
    description: "Cream of Tomato Soup, Herb Roasted Potatoes, Paneer Steak with Brown Sauce, Garlic Bread & Brownies.",
    quantity: "60 meals",
    estimatedMeals: 60,
    preparationTime: "Freshly prepared 1 hour ago",
    pickupLocation: {
      address: "Kodialban Lawns, MG Road",
      city: "Mangalore",
      postalCode: "575003",
      coordinates: [74.8460, 12.8800]
    },
    pickupWindow: {
      from: "21:00",
      to: "23:30",
      date: "2026-10-04"
    },
    foodSafetyInfo: {
      temperatureMaintained: "Hot insulated food warmers",
      containerType: "Hot Insulated Boxes",
      allergens: "Gluten, Milk, Garlic"
    },
    status: "AVAILABLE",
    ngoId: null,
    ngoName: null,
    volunteerId: null,
    volunteerName: null,
    createdAt: "2026-10-04T15:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800"
  }
];

export const initialNgos = [
  {
    id: "NGO-101",
    organizationName: "Hope Shelter & Community Kitchen",
    registrationNumber: "REG-KA-2018-8842",
    contactPerson: "Sister Maria D'Souza",
    email: "contact@hopeshelter.org",
    phone: "+91 98765 43210",
    address: "14 Heritage Road, Mangalore, Karnataka",
    verificationStatus: "VERIFIED",
    capacity: "Feeds up to 300 individuals daily",
    description: "Providing shelter, daily warm meals, and holistic support to homeless individuals and underprivileged families."
  },
  {
    id: "NGO-102",
    organizationName: "Annapurna Food Trust",
    registrationNumber: "REG-KA-2020-1129",
    contactPerson: "Rajesh Bhat",
    email: "info@annapurnatrust.org",
    phone: "+91 98123 45678",
    address: "88 Central Community Hub, Mangalore, Karnataka",
    verificationStatus: "VERIFIED",
    capacity: "Feeds up to 500 individuals daily",
    description: "Dedicated to zero hunger in urban slums through prompt redistribution of surplus cooked food."
  },
  {
    id: "NGO-103",
    organizationName: "Grace Care Home & Children Center",
    registrationNumber: "REG-KA-2016-4401",
    contactPerson: "David Fernandes",
    email: "care@gracehome.org",
    phone: "+91 97654 32109",
    address: "42 Meadow Lane, Mangalore, Karnataka",
    verificationStatus: "VERIFIED",
    capacity: "Home for 120 children and senior citizens",
    description: "Offering safe housing, education, and nutritious food to orphaned children and elderly residents."
  }
];

export const initialVolunteers = [
  {
    id: "VOL-101",
    name: "Rahul Sharma",
    phone: "+91 98989 89898",
    vehicleType: "Motorcycle with Insulated Carrier",
    completedPickups: 48,
    status: "ACTIVE"
  },
  {
    id: "VOL-102",
    name: "Priya Patel",
    phone: "+91 97979 79797",
    vehicleType: "Compact SUV",
    completedPickups: 32,
    status: "ACTIVE"
  }
];

export const initialNotifications = [
  {
    id: "NOTIF-01",
    userId: "donor-01",
    role: "donor",
    title: "Donation Accepted",
    message: "Hope Shelter & Community Kitchen has accepted your donation #FC-1002 (85 meals).",
    timestamp: "2026-10-04T13:15:00Z",
    read: false,
    donationId: "FC-1002"
  },
  {
    id: "NOTIF-02",
    userId: "ngo-01",
    role: "ngo",
    title: "New Surplus Food Available",
    message: "A new surplus donation #FC-1001 (150 meals) was posted nearby at Anand Banquet Hall.",
    timestamp: "2026-10-04T14:02:00Z",
    read: false,
    donationId: "FC-1001"
  },
  {
    id: "NOTIF-03",
    userId: "volunteer-01",
    role: "volunteer",
    title: "Pickup Assignment Available",
    message: "A pickup is ready for transport: Sunnyside Club to Annapurna Food Trust (#FC-1003).",
    timestamp: "2026-10-04T11:50:00Z",
    read: true,
    donationId: "FC-1003"
  }
];

export const faqsList = [
  {
    question: "What kind of food can I donate on FOOD CONNECT?",
    answer: "You can donate safe, unserved surplus cooked food from events such as weddings, corporate functions, parties, and institutional gatherings. Food must be freshly prepared, untasted, and stored in hygienic containers."
  },
  {
    question: "How soon after an event should I post leftover food?",
    answer: "We recommend posting as soon as your event concludes or when you anticipate surplus food, ideally within 1 to 2 hours of preparation. Prompt posting gives NGOs and volunteers sufficient time for safe pickup and distribution."
  },
  {
    question: "Who collects and transports the food?",
    answer: "Verified volunteers registered on FOOD CONNECT transport the food using personal vehicles equipped with food safety containers, moving it directly from the donor location to the accepting NGO."
  },
  {
    question: "How are participating NGOs verified?",
    answer: "Every NGO undergoes strict verification of their government registration, food storage facilities, capacity to serve meals, and hygiene practices before being allowed to accept donations."
  },
  {
    question: "Is there any financial cost involved?",
    answer: "No. FOOD CONNECT is a non-monetary social-impact platform. Donating food, joining as an NGO, and volunteering are completely free."
  },
  {
    question: "How is food safety maintained during redistribution?",
    answer: "Donors provide detailed preparation time and temperature info. Volunteers transport food in insulated containers, and food must be served within designated food-safety windows."
  }
];
