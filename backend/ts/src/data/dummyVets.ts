import type { IVet } from '../models/Vet.js'

// Dummy data for vets (realistic locations in major Indian cities + Mangalore)
export const dummyVets: Partial<IVet>[] = [
  {
    "name": "Little Paws Veterinary Clinic",
    "address": "Charles Pinto Compound, Behind Karnataka Bank, Kulashekara, Mangaluru, Karnataka 575005, India",
    "location": {
      "type": "Point",
      coordinates: [74.876467, 12.885107]
    },
    "city": "Mangaluru",
    "state": "Karnataka",
    "zipCode": "575005",
    "phone": "+91-98445-48311",
    "email": null,
    "rating": 4.4,
    "specialties": ["Consultation", "Vaccination", "ECG", "Puppy Care", "Dermatology", "Dental Checkup", "Pet Grooming"],
    "emergencyService": false,
    "openingHours": {
      "monday": "09:00-20:00",
      "tuesday": "09:00-20:00",
      "wednesday": "09:00-20:00",
      "thursday": "09:00-20:00",
      "friday": "09:00-20:00",
      "saturday": "09:00-20:00",
      "sunday": "09:00-12:00"
    },
    "website": null,
    "description": "One of the major pet clinics in Kulashekara, takes pets’ wellness seriously."
  },
  {
    "name": "Eela Veterinary Clinic",
    "address": "1st Cross Road, Shivbagh, Kadri, Mangaluru, Karnataka 575002, India",
    "location": {
      "type": "Point",
      "coordinates": [74.8599272, 12.878132]
    },
    "city": "Mangaluru",
    "state": "Karnataka",
    "zipCode": "575002",
    "phone": null,
    "email": null,
    "rating": 4.9,
    "specialties": ["General Pet Care"],
    "emergencyService": false,
    "openingHours": {},
    "website": null,
    "description": "Highly rated small-animal clinic in Kadri area."
  },
  {
    "name": "Government Veterinary Polyclinic",
    "address": "Jail Rd, Kodailbail, Mangaluru, Karnataka 575003, India",
    "location": {
      "type": "Point",
      "coordinates": [74.8420595, 12.8792577]
    },
    "city": "Mangaluru",
    "state": "Karnataka",
    "zipCode": "575003",
    "phone": null,
    "email": null,
    "rating": 4.3,
    "specialties": ["Public veterinary services", "Neutering", "Vaccination"],
    "emergencyService": false,
    "openingHours": {},
    "website": null,
    "description": "State-run veterinary facility offering affordable services."
  },
  {
    "name": "Vanasuma Veterinary Clinic",
    "address": "Maroli, Mangaluru, Karnataka 575005, India",
    "location": {
      "type": "Point",
      coordinates: [74.8742596, 12.8757866]
    },
    "city": "Mangaluru",
    "state": "Karnataka",
    "zipCode": "575005",
    "phone": null,
    "email": null,
    "rating": 4.7,
    "specialties": ["General Pet Care", "Critical Care"],
    "emergencyService": false,
    "openingHours": {},
    "website": null,
    "description": "Well-reviewed clinic in Maroli, praised for genuine service."
  },
  {
    "name": "Premchaya City Veterinary Unit",
    "address": "Natyalaya Cross Road, Behind Nandadeep Apartment, Urwa, Mangaluru, Karnataka 575006, India",
    "location": {
      "type": "Point",
      "coordinates": [74.8248141, 12.8924979]
    },
    "city": "Mangaluru",
    "state": "Karnataka",
    "zipCode": "575006",
    "phone": null,
    "email": null,
    "rating": 4.6,
    "specialties": ["Pet Clinic", "General Care"],
    "emergencyService": false,
    "openingHours": {},
    "website": null,
    "description": "Urban pet clinic located in Urwa market area."
  }
]


export default dummyVets
