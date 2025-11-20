
import type { IVet } from '../models/Vet.js'

export const dummyBoardings: Partial<IVet>[] = [
    {
        name: 'Green N Paws',
        address:
            'Parapade 2nd lane, Aakash Bhavan Road, Derebail, Mangaluru, Karnataka 575013, India',
        location: {
            type: 'Point',
            coordinates: [74.8456592, 12.9118101]
        },
        city: 'Mangaluru',
        state: 'Karnataka',
        zipCode: '575013',
        phone: '+91-77605-24444',
        email: 'info@greennpaws.in',
        rating: 5.0,
        specialties: ['Pet Boarding', 'Daycare', 'Pet Transport'],
        emergencyService: false,
        openingHours: {
            monday: '08:00-19:00',
            tuesday: '08:00-19:00',
            wednesday: '08:00-19:00',
            thursday: '08:00-19:00',
            friday: '08:00-19:00',
            saturday: '08:00-19:00'
            // sunday unspecified
        },
        website: 'https://greennpaws.in/',
        description:
            'Premier pet boarding & day-care service in Mangaluru offering secure home-like stays.'
    },
    {
        name: 'Woof and Fur',
        address: 'Garodi Nagori, Mangaluru – 575002 (Kankanady area)',
        location: {
            type: 'Point',
            coordinates: [74.8728645, 12.8693246]
        },
        city: 'Mangaluru',
        state: 'Karnataka',
        zipCode: '575002',
        phone: '+91-85119-39381',
        email: null,
        rating: 4.8,
        specialties: ['Pet Boarding', 'Pet Grooming'],
        emergencyService: false,
        openingHours: {},
        website: null,
        description:
            'Highly rated pet-boarding and grooming centre in the Kankanady / Nagori area.'
    },
    {
        name: 'Mangalore Pet Shack',
        address: 'Mulihithlu, Tillery Road, Bolar, Mangaluru – 575001, India',
        location: {
            type: 'Point',
            coordinates: [74.8458178, 12.8452124]
        },
        city: 'Mangaluru',
        state: 'Karnataka',
        zipCode: '575001',
        // phone omitted (Partial<IVet> lets this be optional)
        email: null,
        rating: 4.7,
        specialties: ['Pet Boarding'],
        emergencyService: false,
        openingHours: {},
        website: null,
        description:
            'Pet boarding facility in Bolar area of Mangaluru, with good customer reviews.'
    }
]

export default dummyBoardings