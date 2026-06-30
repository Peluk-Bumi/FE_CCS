/**
 * Utility for loading partners data from JSON file
 * Provides error handling and fallback functionality
 */

// Default fallback data in case JSON fails to load
const defaultPartners = {
  academic: [
    {
      name: "IWU",
      logo: "/uploads/partners/academic/Logo_Universitas_Wanita_Internasional.svg",
      alt: "IWU Campus Logo",
      imageSize: "h-[5.5rem]"
    }
  ],
  government: [
    {
      name: "Kemendistekdikti",
      logo: "/uploads/partners/government/diktisaintek-berdampak.png",
      alt: "Kemendiktisaintek Logo",
      imageSize: "h-[4.5rem]"
    }
  ],
  partners: [
    {
      name: "Yayasan Sadaya Inspirasi Negeri",
      logo: "/uploads/partners/partners/Yayasan Sadaya Logo_Horizontal-comp.png",
      alt: "Sadaya Logo"
    },
    {
      name: "Pemuda Nusantara Digital Kreatif",
      logo: "/uploads/partners/partners/PDK_logo.png",
      alt: "PNDK Logo"
    },
    {
      name: "Seputar Legal",
      logo: "/uploads/partners/partners/seputar-legal.png",
      alt: "Seputar Legal Logo"
    }
  ],
  supported: [
    {
      name: "Next Cube Digital",
      logo: "/uploads/partners/supported/nexcube-digital.png",
      alt: "Next Cube Logo"
    },
    {
      name: "Elevate Studios",
      logo: "/uploads/partners/supported/Logo elevate studios.png",
      alt: "Elevate Logo",
      imageSize: "h-10"
    },
    {
      name: "Wylkpy Creative Collective",
      logo: "/uploads/partners/supported/Wylpky 2.0 logo.png",
      alt: "Wylkpy Logo",
      imageSize: "h-9"
    },
    {
      name: "Maulia and Partners",
      logo: "/uploads/partners/supported/maulia-logo.png",
      alt: "Maulia Logo"
    },
    {
      name: "Gen Wirausaha Milenial",
      logo: "/uploads/partners/supported/Logo GenW.png",
      alt: "Gen Wirausaha Logo"
    }
  ]
};

/**
 * Validates partner data structure
 * @param {Object} data - Partners data to validate
 * @returns {boolean} - Whether data is valid
 */
function validatePartnersData(data) {
  if (!data || typeof data !== 'object') return false;
  
  const requiredCategories = ['academic', 'government', 'partners', 'supported'];
  
  return requiredCategories.every(category => {
    if (!Array.isArray(data[category])) return false;
    
    return data[category].every(partner => {
      return partner && 
             typeof partner.name === 'string' && 
             typeof partner.logo === 'string' && 
             typeof partner.alt === 'string';
    });
  });
}

/**
 * Loads partners data from JSON file with error handling
 * @returns {Promise<Object>} - Partners data
 */
export async function loadPartnersData() {
  try {
    // Try to fetch the JSON file
    const response = await fetch('/data/partners.json');
    
    if (!response.ok) {
      console.warn('Partners JSON file not found, using fallback data');
      return defaultPartners;
    }
    
    const data = await response.json();
    
    // Validate the loaded data
    if (!validatePartnersData(data)) {
      console.error('Invalid partners data structure, using fallback data');
      return defaultPartners;
    }
    
    console.log('Partners data loaded successfully from JSON');
    return data;
    
  } catch (error) {
    console.error('Error loading partners data:', error);
    console.warn('Using fallback partners data');
    return defaultPartners;
  }
}

/**
 * Get partners data synchronously (for initial render)
 * @returns {Object} - Default partners data
 */
export function getDefaultPartnersData() {
  return defaultPartners;
}
