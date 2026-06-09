export interface Truck {
  id: number;
  name: string;
  image: string;
}

export const trucks: Truck[] = [
  { id: 1, name: "TAUTLINER\n(CURAINSIDER)", image: "/truck1.png" },
  { id: 2, name: "REFRIGERATED TRUCK", image: "/truck2.png" },
  { id: 3, name: "ISOTHERM TRUCK", image: "/truck3.png" },
  { id: 4, name: "MEGA-TRAILER", image: "/truck4.png" },
  { id: 5, name: "JUMBO", image: "/truck5.png" },
  { id: 6, name: "CUSTOM TRUCK", image: "/truck6.png" },
];

export interface Product {
  type: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  color: string;
}

export const sampleProducts: Product[] = [
  { type: "📦", name: "Boxes 1", length: 500, width: 300, height: 300, weight: 45, quantity: 80, color: "var(--color-success)" },
  { type: "🧦", name: "Socks", length: 1000, width: 300, height: 300, weight: 45, quantity: 100, color: "#eb2f96" },
  { type: "👜", name: "Big Bags", length: 1000, width: 1000, height: 1000, weight: 50, quantity: 16, color: "var(--color-info)" },
];
