
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
  products: "https://jsonplaceholder.typicode.com/posts",
  users: "https://jsonplaceholder.typicode.com/users",
  comments: "https://jsonplaceholder.typicode.com/comments"
};

export const simulateApiCall = async (endpoint: string): Promise<any[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (endpoint.includes("products") || endpoint.includes("posts")) {
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
  
  return sampleCsvData;
};
