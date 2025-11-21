const API_URL = 'http://localhost:3000/api/strays';

export interface Stray {
    _id: string;
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    animalType: string;
    gender: string;
    isSterilized: boolean;
    surveyData?: {
        earsNotched?: string;
        hasCollar?: string;
        surgicalMarks?: string;
        isLactating?: string;
        isPregnant?: string;
        recentlyDelivered?: string;
        testicularIssues?: string;
        isFriendly?: string;
        showsAggression?: string;
        allowsTouch?: string;
        notes?: string;
    };
    createdAt: string;
}

export const getStrays = async (): Promise<Stray[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch strays');
    }
    return response.json();
};

export const updateStraySurvey = async (id: string, surveyData: any) => {
    const response = await fetch(`${API_URL}/${id}/survey`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ surveyData }),
    });
    if (!response.ok) {
        throw new Error('Failed to update survey');
    }
    return response.json();
};

// Temporary helper to seed data if needed (optional, but good for testing)
export const createStray = async (strayData: Partial<Stray>) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(strayData),
    });
    if (!response.ok) {
        throw new Error('Failed to create stray');
    }
    return response.json();
};
