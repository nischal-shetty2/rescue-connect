import type { DiseaseInfo } from '../DiseaseDetect.types'
import type { AnimalId, SeverityLevel } from './DiseaseDetect'

export const commonSymptoms: Record<AnimalId, string[]> = {
  dog: [
    'Itching/Scratching',
    'Hair Loss',
    'Red/Inflamed Skin',
    'Scabs/Crusts',
    'Bad Odor',
    'Excessive Licking',
  ],
  cat: [
    'Excessive Grooming',
    'Hair Loss',
    'Scabs',
    'Red Patches',
    'Flaky Skin',
    'Behavioral Changes',
  ],
  cow: [
    'Skin Lesions',
    'Hair Loss',
    'Thickened Skin',
    'Scabs',
    'Swelling',
    'Discoloration',
  ],
}

export const mockDiseases: Record<AnimalId, Record<string, DiseaseInfo>> = {
  dog: {
    'Flea Allergy Dermatitis': {
      confidence: 88,
      severity: 'medium',
      description:
        'Allergic reaction to flea bites causing intense itching and secondary skin changes.',
      symptoms: [
        'Intense itching',
        'Flea dirt or fleas visible',
        'Hair loss',
        'Red/irritated skin',
      ],
      treatment: {
        medication: 'Flea control (Frontline, NexGard, Bravecto)',
        dosage: 'Follow product label/dose for patient weight',
        topical: 'Topical flea products as indicated',
        additional: [
          'Treat environment and all in-contact pets',
          'Anti-inflammatories for severe itching',
        ],
      },
      urgency: 'Moderate - Treat promptly to stop ongoing exposure',
    },
    'Atopic Dermatitis': {
      confidence: 82,
      severity: 'medium',
      description:
        'Chronic allergic skin disease often due to environmental allergens.',
      symptoms: [
        'Seasonal or chronic itching',
        'Red/inflamed skin',
        'Secondary infections',
        'Ear inflammation',
      ],
      treatment: {
        medication:
          'Antihistamines, corticosteroids, cyclosporine (Atopica), Apoquel, Cytopoint injections',
        dosage: 'Per veterinary prescription',
        topical: 'Soothing shampoos and medicated washes',
        additional: [
          'Identify and reduce allergen exposure',
          'Consider hypoallergenic diet trial if indicated',
        ],
      },
      urgency: 'Low - Chronic management, treat flares as needed',
    },
    Mange: {
      confidence: 85,
      severity: 'high',
      description:
        'Parasitic mite infestation causing severe pruritus and hair loss.',
      symptoms: [
        'Severe itching',
        'Hair loss',
        'Crusted or scabby skin',
        'Thickened skin in chronic cases',
      ],
      treatment: {
        medication:
          'Ivermectin, Milbemycin, Amitraz dips, Lime sulfur dips, Bravecto, NexGard',
        dosage:
          'Per veterinary guidance (dose varies by product and mite species)',
        topical: 'Lime sulfur or Amitraz dips where appropriate',
        additional: [
          'Treat all household animals, environmental cleaning',
          'Monitor for secondary infections',
        ],
      },
      urgency:
        'High - Treat promptly due to severe discomfort and contagious potential',
    },
    'Hot Spots': {
      confidence: 79,
      severity: 'medium',
      description:
        'Acute moist dermatitis typically caused by self-trauma and secondary infection.',
      symptoms: [
        'Well-demarcated red moist lesions',
        'Rapid onset',
        'Intense licking/chewing',
      ],
      treatment: {
        medication:
          'Topical antibiotics (Neomycin, Mupirocin), corticosteroid sprays',
        dosage: 'Topical application per product',
        topical: 'Cleanse with chlorhexidine; apply topical meds',
        additional: [
          'Clip and clean area, prevent licking (E-collar)',
          'Treat underlying cause (allergy, parasites)',
        ],
      },
      urgency: 'Moderate - Treat quickly to control infection and pain',
    },
    'Yeast Infection': {
      confidence: 80,
      severity: 'medium',
      description:
        'Malassezia or other yeast overgrowth causing greasy or odorous skin and itching.',
      symptoms: [
        'Greasy, smelly coat',
        'Itching',
        'Redness and scaling',
        'Interdigital involvement common',
      ],
      treatment: {
        medication:
          'Antifungal shampoos (Ketoconazole, Miconazole, Chlorhexidine), oral antifungals (Fluconazole, Itraconazole)',
        dosage: 'Topical or oral per vet guidance',
        topical: 'Medicated antifungal shampoos/cleansers',
        additional: [
          'Address underlying allergies or moisture issues',
          'Repeat treatments until resolved',
        ],
      },
      urgency: 'Low - Manageable but needs treatment to resolve symptoms',
    },
    Ringworm: {
      confidence: 91,
      severity: 'high',
      description:
        'Dermatophytic fungal infection causing circular alopecic crusting lesions; zoonotic.',
      symptoms: [
        'Circular hairless patches',
        'Scaly/crusty skin',
        'Variable itching',
      ],
      treatment: {
        medication:
          'Topical antifungals (Clotrimazole, Miconazole), oral antifungals (Griseofulvin, Itraconazole)',
        dosage: 'Oral/topical per veterinary instructions',
        topical: 'Antifungal washes and environmental decontamination',
        additional: [
          'Isolate affected animals',
          'High contagion risk; disinfect environment',
        ],
      },
      urgency: 'High - Zoonotic and contagious; treat promptly',
    },
    'Bacterial Infection': {
      confidence: 86,
      severity: 'medium',
      description:
        'Bacterial overgrowth or infection often secondary to other skin disease.',
      symptoms: [
        'Pustules, crusts',
        'Redness',
        'Foul odor in severe cases',
        'Pruritus',
      ],
      treatment: {
        medication:
          'Antibiotics (Cephalexin, Clindamycin, Amoxicillin-Clavulanate), medicated shampoos (Chlorhexidine)',
        dosage: 'Per culture/sensitivity and veterinary guidance',
        topical: 'Chlorhexidine washes',
        additional: [
          'Consider culture for recurrent cases',
          'Address underlying cause',
        ],
      },
      urgency: 'Moderate - Treat to prevent deeper infection',
    },
    'Dry Skin': {
      confidence: 70,
      severity: 'low',
      description:
        'Non-specific dry or flaky skin often due to environmental or dietary factors.',
      symptoms: ['Scaling/flaking', 'Dull coat', 'Mild pruritus'],
      treatment: {
        medication:
          'Omega-3 fatty acid supplements, moisturizing shampoos, improved diet',
        dosage:
          'Supplement per product label; vet guidance for longer-term use',
        topical: 'Moisturizing shampoos and conditioners',
        additional: [
          'Improve nutrition and humidity',
          'Rule out underlying disease if persistent',
        ],
      },
      urgency: 'Low - Manageable with supportive care',
    },
    Seborrhea: {
      confidence: 72,
      severity: 'low',
      description:
        'Seborrheic dermatitis leading to oily or dry scaling and odor.',
      symptoms: ['Greasy or scaly skin', 'Bad odor', 'Variable itching'],
      treatment: {
        medication:
          'Medicated shampoos (Sulfur, Salicylic acid, Benzoyl peroxide), omega-3 supplements, retinoids in chronic cases',
        dosage: 'Topical regimens per product',
        topical: 'Regular medicated bathing',
        additional: [
          'Long-term management often required',
          'Address secondary infections',
        ],
      },
      urgency: 'Low - Chronic management',
    },
    'Food Allergy Dermatitis': {
      confidence: 78,
      severity: 'medium',
      description:
        'Allergic reaction to dietary proteins causing itching and GI/skin signs.',
      symptoms: [
        'Chronic itching',
        'Ear inflammation',
        'GI signs may be present',
      ],
      treatment: {
        medication:
          'Hypoallergenic diet trial (hydrolyzed or limited-ingredient food), antihistamines if needed',
        dosage: 'Diet trial for 8-12 weeks as directed by vet',
        topical: 'Symptomatic topical therapy for skin lesions',
        additional: [
          'Strict diet adherence during trial',
          'Rechallenge only under vet supervision',
        ],
      },
      urgency: 'Low - Controlled with diet management',
    },
    'Tick-borne Dermatitis': {
      confidence: 75,
      severity: 'medium',
      description:
        'Dermatitis from tick bites or tick-borne pathogens; may lead to localized infection.',
      symptoms: [
        'Local irritation at bite sites',
        'Possible secondary infection',
        'Regional hair loss',
      ],
      treatment: {
        medication:
          'Tick removal, tick preventives (Simparica, Bravecto), antibiotics if secondary infection',
        dosage: 'Follow product label and vet guidance',
        topical: 'Clean bite sites with antiseptic washes',
        additional: [
          'Prevent future tick exposure',
          'Check for systemic signs of tick-borne disease',
        ],
      },
      urgency:
        'Moderate - Remove ticks promptly and monitor for systemic illness',
    },
    'Contact Dermatitis': {
      confidence: 68,
      severity: 'low',
      description:
        'Irritant or allergic contact reaction causing localized inflammation.',
      symptoms: [
        'Localized redness',
        'Scaling or crusting',
        'Pruritus at contact sites',
      ],
      treatment: {
        medication:
          'Identify and remove irritant, topical corticosteroids, soothing oatmeal or aloe shampoos',
        dosage: 'Topical therapy as directed',
        topical: 'Soothing cleansers and topical steroids',
        additional: [
          'Avoid known irritants',
          'Short-term symptomatic treatment',
        ],
      },
      urgency: 'Low - Identify and avoid cause; treat symptoms',
    },
    'Hormonal Skin Disease': {
      confidence: 65,
      severity: 'low',
      description:
        'Skin changes secondary to endocrine disorders (hypothyroidism, Cushing’s).',
      symptoms: ['Symmetrical hair loss', 'Thin skin', 'Recurrent infections'],
      treatment: {
        medication:
          'Thyroid hormone supplementation (Levothyroxine) or other endocrine treatments',
        dosage: 'Per diagnostic results and veterinary prescription',
        topical: 'Supportive skin care',
        additional: [
          'Diagnose and treat the underlying endocrine disorder',
          'Monitor bloodwork regularly',
        ],
      },
      urgency: 'Low - Requires diagnostic workup and long-term management',
    },
  },
  cat: {
    'Flea Allergy Dermatitis': {
      confidence: 89,
      severity: 'medium',
      description:
        'Intense allergic reaction to flea bites; cats often over-groom and develop hair loss.',
      symptoms: [
        'Excessive grooming',
        'Hair loss',
        'Small scabs',
        'Flea dirt/visible fleas',
      ],
      treatment: {
        medication:
          'Flea control (Revolution, Advantage, Frontline), antihistamines, corticosteroids for inflammation',
        dosage: 'Follow product label and veterinary dosing',
        topical: 'Topical flea treatments as recommended',
        additional: [
          'Treat all in-contact animals and environment',
          'Use E-collar if necessary to prevent self-trauma',
        ],
      },
      urgency: 'Moderate - Control fleas promptly',
    },
    'Atopic Dermatitis': {
      confidence: 80,
      severity: 'medium',
      description:
        'Chronic allergic skin disease in cats, can present with miliary dermatitis or eosinophilic lesions.',
      symptoms: [
        'Itching',
        'Miliary dermatitis',
        'Eosinophilic plaques',
        'Facial/neck grooming lesions',
      ],
      treatment: {
        medication:
          'Antihistamines, corticosteroids, cyclosporine (Atopica for cats), hypoallergenic environment',
        dosage: 'Per veterinary guidance',
        topical: 'Soothing shampoos and topical therapies for lesions',
        additional: [
          'Environmental control and allergen reduction',
          'Consider diet trial if indicated',
        ],
      },
      urgency: 'Low - Chronic condition with episodic flares',
    },
    Mange: {
      confidence: 78,
      severity: 'medium',
      description:
        'Parasitic mite infestations in cats; presentation and treatment must consider feline safety.',
      symptoms: ['Intense itch', 'Crusting/scaling', 'Hair loss'],
      treatment: {
        medication:
          'Lime sulfur dips, Ivermectin (careful with dosage), Selamectin (Revolution), Milbemycin',
        dosage: 'Use only vet-prescribed products at feline-safe doses',
        topical: 'Lime sulfur dips where appropriate',
        additional: [
          'Treat all in-contact animals, follow feline-safe protocols',
        ],
      },
      urgency:
        'High - Can be severe and uncomfortable; treat under vet guidance',
    },
    Ringworm: {
      confidence: 88,
      severity: 'high',
      description:
        'Fungal infection commonly causing circular alopecia and crusting; zoonotic.',
      symptoms: ['Hairless scaly patches', 'Crusts', 'Mild pruritus'],
      treatment: {
        medication:
          'Topical antifungals (Miconazole, Enilconazole), oral antifungals (Itraconazole, Terbinafine)',
        dosage: 'Per veterinary instructions',
        topical: 'Topical antifungal creams/washes',
        additional: [
          'Environmental decontamination',
          'Isolate affected animals until resolved',
        ],
      },
      urgency: 'High - Zoonotic infection; treat promptly',
    },
    'Bacterial Infection': {
      confidence: 82,
      severity: 'medium',
      description:
        'Bacterial skin infection in cats often secondary to trauma or other skin disease.',
      symptoms: ['Pustules', 'Crusts', 'Redness', 'Focal alopecia'],
      treatment: {
        medication:
          'Antibiotics (Clindamycin, Cephalexin, Amoxicillin-Clavulanate), antiseptic shampoos (Chlorhexidine)',
        dosage: 'Per veterinary guidance and culture when indicated',
        topical: 'Antiseptic washes',
        additional: ['Address underlying causes such as fleas or allergies'],
      },
      urgency: 'Moderate - Treat to prevent progression',
    },
    'Yeast Infection': {
      confidence: 75,
      severity: 'medium',
      description: 'Yeast overgrowth causing odor, greasiness and itching.',
      symptoms: ['Greasy skin', 'Odor', 'Scaling', 'Itching'],
      treatment: {
        medication:
          'Antifungal shampoos (Miconazole, Chlorhexidine), oral antifungals (Itraconazole)',
        dosage: 'Per product/vet instructions',
        topical: 'Medicated antifungal washes',
        additional: ['Address underlying allergies or moisture problems'],
      },
      urgency: 'Low - Manageable with antifungal therapy',
    },
    'Eosinophilic Granuloma Complex': {
      confidence: 70,
      severity: 'medium',
      description:
        'Immune-mediated lesions often linked to allergies or parasites.',
      symptoms: [
        'Swelling or plaques',
        'Ulcerated lesions',
        'Variable itching',
      ],
      treatment: {
        medication: 'Corticosteroids (Prednisolone), cyclosporine',
        dosage: 'Per veterinary prescription',
        topical: 'Topical wound care as needed',
        additional: ['Investigate and treat underlying allergies/parasites'],
      },
      urgency: 'Moderate - Treat to reduce discomfort and prevent progression',
    },
    'Feline Acne': {
      confidence: 65,
      severity: 'low',
      description:
        'Follicular inflammation on chin/face often related to contact or bacterial overgrowth.',
      symptoms: ['Comedones on chin', 'Pustules', 'Crusting around chin'],
      treatment: {
        medication:
          'Topical cleansing with benzoyl peroxide or chlorhexidine, topical antibiotics (Mupirocin)',
        dosage: 'Topical therapy per vet direction',
        topical: 'Daily cleansing and topical antimicrobials',
        additional: [
          'Use stainless steel/ceramic bowls',
          'Address any underlying skin disease',
        ],
      },
      urgency:
        'Low - Typically cosmetic but treat if secondary infection present',
    },
    'Ear Mites': {
      confidence: 85,
      severity: 'medium',
      description:
        'Highly pruritic ear infestation causing dark debris and head shaking.',
      symptoms: [
        'Intense ear scratching',
        'Dark waxy discharge',
        'Head shaking',
      ],
      treatment: {
        medication:
          'Topical treatments (Selamectin, Ivermectin, Moxidectin), ear cleaning',
        dosage: 'Per veterinary product instructions',
        topical: 'Ear-specific acaricidal drops',
        additional: [
          'Treat all in-contact pets',
          'Clean environment and bedding',
        ],
      },
      urgency: 'Moderate - Treat quickly to relieve severe itch',
    },
  },
  cow: {
    'Bovine Respiratory Disease (BRD)': {
      confidence: 88,
      severity: 'high',
      description:
        'Complex of infectious respiratory diseases in cattle often requiring systemic therapy.',
      symptoms: ['Coughing', 'Fever', 'Nasal discharge', 'Depressed mentation'],
      treatment: {
        medication:
          'Broad-spectrum antibiotics (Tilmicosin, Florfenicol, Enrofloxacin), anti-inflammatories (Flunixin Meglumine)',
        dosage: 'Veterinary-prescribed systemic dosing',
        topical: 'Supportive care and ventilation improvements',
        additional: [
          'Vaccination for prevention',
          'Isolate and treat affected animals',
        ],
      },
      urgency: 'High - Can be severe and herd-impacting',
    },
    Bovine: {
      confidence: 60,
      severity: 'low',
      description:
        'General cattle health maintenance and preventative care recommendations.',
      symptoms: ['Normal appetite and behavior when healthy'],
      treatment: {
        medication:
          'General health maintenance through balanced nutrition, deworming, vaccination schedules',
        dosage: 'Per herd health program',
        topical: 'Good housing and hygiene',
        additional: [
          'Regular veterinary herd checks',
          'Appropriate supplementation',
        ],
      },
      urgency: 'Low - Preventative care',
    },
    'Contagious Bovine Pleuropneumonia (CBPP)': {
      confidence: 78,
      severity: 'high',
      description:
        'Serious contagious respiratory disease requiring isolation and treatment/control measures.',
      symptoms: ['Respiratory distress', 'Fever', 'Coughing', 'Weight loss'],
      treatment: {
        medication:
          'Antibiotics (Tylosin, Oxytetracycline), isolation of infected animals',
        dosage: 'Per veterinary guidance and local regulations',
        topical: 'Supportive care',
        additional: ['Movement control and vaccination where available'],
      },
      urgency:
        'High - Reportable/serious disease; follow vet and regulatory guidance',
    },
    Dermatitis: {
      confidence: 72,
      severity: 'medium',
      description:
        'Generic dermatitis in cattle treated with topical antiseptics and hygiene changes.',
      symptoms: ['Redness', 'Scabs/crusts', 'Hair loss'],
      treatment: {
        medication:
          'Topical antiseptics (Chlorhexidine, Iodine), systemic antibiotics if severe',
        dosage: 'Per veterinary instructions',
        topical: 'Antiseptic washes and improved hygiene',
        additional: [
          'Keep environment dry and clean',
          'Isolate severely affected animals',
        ],
      },
      urgency: 'Moderate - Treat to prevent spread and complications',
    },
    'Ecthyma (Contagious Pustular Dermatitis)': {
      confidence: 76,
      severity: 'medium',
      description:
        'Viral pustular disease of cattle often requiring topical care and isolation.',
      symptoms: [
        'Pustular lesions around mouth and muzzle',
        'Painful eating/drinking',
      ],
      treatment: {
        medication: 'Topical antiseptics, zinc oxide ointment for healing',
        dosage: 'Supportive and topical care per vet guidance',
        topical: 'Antiseptics and protective ointments',
        additional: [
          'Isolate infected animals',
          'Consider autogenous vaccine in severe outbreaks',
        ],
      },
      urgency: 'Moderate - Isolate and manage affected animals',
    },
    Respiratory: {
      confidence: 70,
      severity: 'high',
      description:
        'General respiratory disease category in cattle needing systemic therapy and supportive care.',
      symptoms: ['Cough', 'Nasal discharge', 'Fever', 'Lethargy'],
      treatment: {
        medication:
          'Broad-spectrum antibiotics (Oxytetracycline, Enrofloxacin), NSAIDs for inflammation',
        dosage: 'Per veterinary guidance',
        topical: 'Supportive environmental measures',
        additional: [
          'Improve ventilation and reduce stress',
          'Vaccination for prevention',
        ],
      },
      urgency: 'High - Treat sick animals and prevent spread',
    },
    Healthy: {
      confidence: 50,
      severity: 'low',
      description: 'Healthy herd guidance for prevention of common diseases.',
      symptoms: ['No abnormal clinical signs when healthy'],
      treatment: {
        medication:
          'Regular deworming, vaccination (FMD, LSD, BRD complex), mineral supplementation',
        dosage: 'Per herd health plan',
        topical: 'Maintain clean shelter',
        additional: ['Good nutrition and management practices'],
      },
      urgency: 'Low - Preventative focus',
    },
    'Lumpy Skin Disease': {
      confidence: 83,
      severity: 'high',
      description:
        'Poxviral disease leading to nodular skin lesions and systemic signs.',
      symptoms: [
        'Firm nodular skin lesions',
        'Fever',
        'Lameness',
        'Reduced milk yield',
      ],
      treatment: {
        medication:
          'Vaccination (live attenuated LSD vaccine), supportive care (NSAIDs, antibiotics for secondary infection)',
        dosage: 'Follow veterinary and regional guidance',
        topical: 'Symptomatic topical care for lesions',
        additional: ['Isolate affected animals', 'Fly control measures'],
      },
      urgency: 'High - Immediate action required for herd health',
    },
    'Skin Disease': {
      confidence: 68,
      severity: 'medium',
      description:
        'General skin disease management for cattle including fungal and parasitic causes.',
      symptoms: ['Scales, crusts, hair loss', 'Itching or irritation'],
      treatment: {
        medication:
          'Topical antifungals (Enilconazole, Iodine), acaricides for parasites (Amitraz, Ivermectin)',
        dosage: 'Per veterinary instructions',
        topical: 'Antifungal washes and acaricidal treatments',
        additional: [
          'Maintain hygiene and reduce humidity',
          'Isolate infected animals if contagious',
        ],
      },
      urgency: 'Moderate - Manage and treat based on specific diagnosis',
    },
  },
}

export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
