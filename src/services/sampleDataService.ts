
export interface SampleDataItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
  owner: {
    name: string;
    email: string;
  };
}

export const sampleCsvData: SampleDataItem[] = [
  {
    id: 1,
    name: "Product A",
    category: "Electronics",
    price: 299.99,
    quantity: 50,
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    owner: { name: "John Smith", email: "john@example.com" }
  },
  {
    id: 2,
    name: "Product B",
    category: "Clothing",
    price: 49.99,
    quantity: 100,
    status: "active",
    created_at: "2024-01-16T14:20:00Z",
    owner: { name: "Jane Doe", email: "jane@example.com" }
  },
  {
    id: 3,
    name: "Product C",
    category: "Electronics",
    price: 199.99,
    quantity: 0,
    status: "out_of_stock",
    created_at: "2024-01-17T09:15:00Z",
    owner: { name: "Bob Wilson", email: "bob@example.com" }
  },
  {
    id: 4,
    name: "Product D",
    category: "Books",
    price: 24.99,
    quantity: 75,
    status: "active",
    created_at: "2024-01-18T16:45:00Z",
    owner: { name: "Alice Brown", email: "alice@example.com" }
  },
  {
    id: 5,
    name: "Product E",
    category: "Electronics",
    price: 599.99,
    quantity: 25,
    status: "discontinued",
    created_at: "2024-01-19T11:30:00Z",
    owner: { name: "Charlie Davis", email: "charlie@example.com" }
  }
];

export const sampleApiEndpoints = {
  posts: "https://jsonplaceholder.typicode.com/posts",
  users: "https://jsonplaceholder.typicode.com/users",
  comments: "https://jsonplaceholder.typicode.com/comments",
  countries: "https://restcountries.com/v3.1/all",
  crypto: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
  catFacts: "https://catfact.ninja/facts",
  randomUsers: "https://randomuser.me/api/?results=5",
  ipInfo: "https://api.ipify.org?format=json"
};

export const simulateApiCall = async (endpoint: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Handle different API types
  if (endpoint.includes("posts") || endpoint.includes("jsonplaceholder")) {
    return sampleCsvData.map(item => ({
      id: item.id,
      title: item.name,
      body: `Description for ${item.name}`,
      userId: item.id,
      category: item.category,
      price: item.price,
      status: item.status,
      createdAt: item.created_at,
      owner: item.owner
    }));
  }
  
  if (endpoint.includes("countries")) {
    return [
      { name: { common: "United States" }, capital: ["Washington"], population: 331000000, region: "Americas" },
      { name: { common: "Canada" }, capital: ["Ottawa"], population: 38000000, region: "Americas" },
      { name: { common: "United Kingdom" }, capital: ["London"], population: 67000000, region: "Europe" }
    ];
  }
  
  if (endpoint.includes("crypto") || endpoint.includes("coingecko")) {
    return [
      { id: "bitcoin", name: "Bitcoin", symbol: "btc", current_price: 45000, market_cap: 850000000000 },
      { id: "ethereum", name: "Ethereum", symbol: "eth", current_price: 3000, market_cap: 360000000000 },
      { id: "cardano", name: "Cardano", symbol: "ada", current_price: 0.5, market_cap: 17000000000 }
    ];
  }
  
  if (endpoint.includes("catfact")) {
    return [
      { fact: "Cats sleep 70% of their lives.", length: 29 },
      { fact: "A group of cats is called a clowder.", length: 38 },
      { fact: "Cats have over 20 muscles that control their ears.", length: 51 }
    ];
  }
  
  if (endpoint.includes("randomuser")) {
    return [
      { 
        name: { first: "John", last: "Doe" },
        email: "john.doe@example.com",
        location: { city: "New York", country: "US" },
        picture: { large: "https://randomuser.me/api/portraits/men/1.jpg" }
      },
      { 
        name: { first: "Jane", last: "Smith" },
        email: "jane.smith@example.com",
        location: { city: "London", country: "UK" },
        picture: { large: "https://randomuser.me/api/portraits/women/1.jpg" }
      }
    ];
  }
  
  // Default to sample CSV data
  return sampleCsvData;
};

// New function for testing real API calls
export const testRealApiCall = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
