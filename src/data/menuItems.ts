import { MenuItem, WunschPizzaIngredient, PizzaExtra, PastaType, SauceType } from '../types';

// Helper functions to check current day for special offers
const isRippchen = () => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return today === 3; // Wednesday
};

const isSchnitzelTag = () => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return today === 4; // Thursday
};

// Pizza sizes configuration with new structure
const pizzaSizes = [
  { name: 'Medium', price: 8.90, description: 'Ø ca. 26 cm' },
  { name: 'Large', price: 9.90, description: 'Ø ca. 30 cm' },
  { name: 'Family', price: 17.90, description: 'Ø ca. 40 cm' },
  { name: 'Mega', price: 26.90, description: 'Ø ca. 50 cm' }
];

// Pasta types for pasta dishes
export const pastaTypes: PastaType[] = [
  { name: 'Spaghetti' },
  { name: 'Maccheroni' }
];

// Sauce types for Spezialitäten
export const sauceTypes: SauceType[] = [
  { name: 'Tzatziki' },
  { name: 'ohne Soße' }
];

// Sauce types for Salads
export const saladSauceTypes: SauceType[] = [
  { name: 'Joghurt' },
  { name: 'French' },
  { name: 'Essig/Öl' }
];

// Beer types for beer selection
export const beerTypes: SauceType[] = [
  { name: 'Becks' },
  { name: 'Herrenhäuser' }
];

// Wunsch Pizza ingredients - Updated with new items and removed "Ei", Rindersalami now available
export const wunschPizzaIngredients: WunschPizzaIngredient[] = [
  { name: 'Ananas' },
  { name: 'Artischocken' },
  { name: 'Barbecuesauce' },
  { name: 'Brokkoli' },
  { name: 'Champignons frisch' },
  { name: 'Chili-Cheese-Soße' },
  { name: 'Edamer' },
  { name: 'Formfleisch-Vorderschinken' },
  { name: 'Gewürzgurken' },
  { name: 'Gorgonzola' },
  { name: 'Gyros' },
  { name: 'Hirtenkäse' },
  { name: 'Hähnchenbrust' },
  { name: 'Jalapeños' },
  { name: 'Knoblauchwurst' },
  { name: 'Mais' },
  { name: 'Milde Peperoni' },
  { name: 'Mozzarella' },
  { name: 'Oliven' },
  { name: 'Paprika' },
  { name: 'Parmaschinken' },
  { name: 'Peperoni, scharf' },
  { name: 'Remoulade' },
  { name: 'Rindermett' },
  { name: 'Rindersalami' },
  { name: 'Rucola' },
  { name: 'Röstzwiebeln' },
  { name: 'Sauce Hollandaise' },
  { name: 'Spiegelei' },
  { name: 'Spinat' },
  { name: 'Tomaten' },
  { name: 'Würstchen' },
  { name: 'Zwiebeln' },
  { name: 'ohne Zutat' }
];

// Pizza extras for all pizzas (each extra costs +€1.50) - Updated to match Wunsch Pizza ingredients
export const pizzaExtras: PizzaExtra[] = [
  { name: 'Ananas', price: 1.00 },
  { name: 'Artischocken', price: 1.00 },
  { name: 'Barbecuesauce', price: 1.00 },
  { name: 'Brokkoli', price: 1.00 },
  { name: 'Champignons frisch', price: 1.00 },
  { name: 'Chili-Cheese-Soße', price: 1.00 },
  { name: 'Edamer', price: 1.00 },
  { name: 'Formfleisch-Vorderschinken', price: 1.00 },
  { name: 'Gewürzgurken', price: 1.00 },
  { name: 'Gorgonzola', price: 1.00 },
  { name: 'Gyros', price: 1.00 },
  { name: 'Hirtenkäse', price: 1.00 },
  { name: 'Hähnchenbrust', price: 1.00 },
  { name: 'Jalapeños', price: 1.00 },
  { name: 'Knoblauchwurst', price: 1.00 },
  { name: 'Mais', price: 1.00 },
  { name: 'Milde Peperoni', price: 1.00 },
  { name: 'Mozzarella', price: 1.00 },
  { name: 'Oliven', price: 1.00 },
  { name: 'Paprika', price: 1.00 },
  { name: 'Parmaschinken', price: 1.00 },
  { name: 'Peperoni, scharf', price: 1.00 },
  { name: 'Remoulade', price: 1.00 },
  { name: 'Rindermett', price: 1.00 },
  { name: 'Rindersalami', price: 1.00 },
  { name: 'Rucola', price: 1.00 },
  { name: 'Röstzwiebeln', price: 1.00 },
  { name: 'Sauce Hollandaise', price: 1.00 },
  { name: 'Spiegelei', price: 1.00 },
  { name: 'Spinat', price: 1.00 },
  { name: 'Tomaten', price: 1.00 },
  { name: 'Würstchen', price: 1.00 },
  { name: 'Zwiebeln', price: 1.00 }
];

// Vegetarische Gerichte (Vegetarian dishes)
export const vegetarischeGerichte: MenuItem[] = [
  {
    id: 519,
    number: 19,
    name: "Zigaretten Börek",
    description: "knusprige Börek-Röllchen, gefüllt mit Käse",
    price: 1.00
  },
  {
    id: 520,
    number: 20,
    name: "Halloumi-Tasche",
    description: "im Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 521,
    number: 21,
    name: "Halloumi-Dürüm",
    description: "im dünnen Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße",
    price: 8.00,
    isSpezialitaet: true
  },
  {
    id: 522,
    number: 22,
    name: "Halloumi-Teller",
    description: "mit gegrilltem Halloumi, Bulgur oder Pommes, Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 523,
    number: 23,
    name: "Falafel-Tasche",
    description: "im Fladenbrot mit hausgemachten Falafel, gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 524,
    number: 24,
    name: "Falafel-Dürüm",
    description: "im dünnen Fladenbrot mit Falafel, gemischtem Salat & Soße",
    price: 8.00,
    isSpezialitaet: true
  },
  {
    id: 525,
    number: 25,
    name: "Falafel-Teller",
    description: "mit Bulgur oder Pommes frites, gemischtem Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  }
];

// Croques
export const croques: MenuItem[] = [
  // This section can be populated with croques later
];

// Helper function to create drink sizes for soft drinks
const createDrinkSizes = (smallPrice: number, largePrice: number = 3.60) => [
  { name: '0,33 L', price: smallPrice, description: 'Klein' },
  { name: '1,0 L', price: largePrice, description: 'Groß' }
];

// Helper function to create burger patty sizes
const createBurgerSizes = (basePrice: number) => [
  { name: '125g', price: basePrice, description: 'Standard Patty' },
  { name: '250g', price: basePrice + 2.00, description: 'Doppel Patty (+2€)' }
];

// Snacks (New section)
export const snacks: MenuItem[] = [
  {
    id: 550,
    number: 11,
    name: "Hamburger",
    description: "125g Burger-Patty",
    price: 5.50
  },
  {
    id: 551,
    number: 12,
    name: "Cheeseburger",
    description: "125g Burger-Patty mit Schmelzkäse",
    price: 6.00
  },
  {
    id: 552,
    number: 13,
    name: "Currywurst & Pommes",
    description: "mit würziger Currysauce und knusprigen Pommes frites",
    price: 8.50
  },
  {
    id: 553,
    number: 14,
    name: "Hamburger Menü",
    description: "125g Burger-Patty, Pommes frites und Getränk",
    price: 11.00
  },
  {
    id: 554,
    number: 15,
    name: "Cheeseburger Menü",
    description: "125g Burger-Patty mit Schmelzkäse, Pommes frites und Getränk",
    price: 11.50
  },
  {
    id: 555,
    number: 16,
    name: "Chicken-Nuggets Menü",
    description: "6 Stück mit Pommes frites & Getränk",
    price: 10.00
  },
  {
    id: 556,
    number: 17,
    name: "Pommes frites",
    description: "",
    price: 4.00
  },
  {
    id: 557,
    number: 18,
    name: "Chicken-Nuggets 6 Stück",
    description: "",
    price: 6.00
  }
];

// Salate (Updated with new items)
export const salads: MenuItem[] = [
  {
    id: 568,
    number: 90,
    name: "Gebackene Camembert",
    description: "2 Stk. Mit Salat und Preiselbeeren",
    price: 10.90,
    isSpezialitaet: true
  },
  {
    id: 569,
    number: 91,
    name: "Fjord",
    description: "mit Räucherlachs, Gemischter Salat, Rosti und Meerrettich",
    price: 11.90,
    isSpezialitaet: true
  },
  {
    id: 570,
    number: 92,
    name: "Chefsalat",
    description: "mit Schinken und Käse",
    price: 10.90,
    isSpezialitaet: true
  },
  {
    id: 571,
    number: 93,
    name: "Thunfischsalat",
    description: "mit Thunfisch und Hirtenkäse",
    price: 10.90,
    isSpezialitaet: true
  },
  {
    id: 572,
    number: 94,
    name: "Tomaten Mozzarella",
    description: "mit fr.Tomaten, Mozzarella, Basilikum und Olivenöl",
    price: 10.90,
    isSpezialitaet: true
  },
  {
    id: 573,
    number: 95,
    name: "Gemischter Salat",
    description: "",
    price: 7.90,
    isSpezialitaet: true
  }
];

// Dips (Saucen) - Updated with new structure and pricing
export const dips: MenuItem[] = [
  {
    id: 201,
    number: "201",
    name: "Mayo",
    description: "",
    price: 1.50
  },
  {
    id: 202,
    number: "202",
    name: "Ketchup",
    description: "",
    price: 1.50
  },
  {
    id: 203,
    number: "203",
    name: "Knobi",
    description: "",
    price: 1.50
  },
  {
    id: 204,
    number: "204",
    name: "Hollandaise",
    description: "",
    price: 1.50
  },
  {
    id: 205,
    number: "205",
    name: "Chilli",
    description: "",
    price: 1.50
  },
  {
    id: 206,
    number: "206",
    name: "BBQ",
    description: "",
    price: 1.50
  }
];

// Getränke (Drinks) - Updated with size options for soft drinks
export const drinks: MenuItem[] = [
  // Soft drinks with size options
  {
    id: 10,
    number: 100,
    name: "Coca-Cola",
    description: "Wählen Sie Ihre gewünschte Größe",
    price: 2.20,
    sizes: createDrinkSizes(2.20)
  },
  {
    id: 11,
    number: 100,
    name: "Coca-Cola Light",
    description: "Wählen Sie Ihre gewünschte Größe",
    price: 2.20,
    sizes: createDrinkSizes(2.20)
  },
  {
    id: 12,
    number: 100,
    name: "Fanta Orange",
    description: "Wählen Sie Ihre gewünschte Größe",
    price: 2.20,
    sizes: createDrinkSizes(2.20)
  },
  {
    id: 13,
    number: 100,
    name: "Sprite",
    description: "Wählen Sie Ihre gewünschte Größe",
    price: 2.20,
    sizes: createDrinkSizes(2.20)
  },
  {
    id: 18,
    number: 101,
    name: "Capri-Sonne",
    description: "0,20 L",
    price: 1.00
  },
  {
    id: 562,
    number: 102,
    name: "Becks oder Herrenhäuser",
    description: "0,3 L",
    price: 2.40,
    isBeerSelection: true
  },
  {
    id: 563,
    number: 103,
    name: "Chianti (Italienische Rotwein)",
    description: "0,7 L",
    price: 9.00
  },
  {
    id: 564,
    number: 104,
    name: "Merlot (Italienische Rotwein)",
    description: "1 L",
    price: 11.00
  },
  {
    id: 565,
    number: 105,
    name: "Suave (Italienischer Weißwein)",
    description: "0,7 L",
    price: 9.00
  },
  {
    id: 566,
    number: 106,
    name: "Chardonney (Italienische Weißwein)",
    description: "1 L",
    price: 11.00
  },
  {
    id: 567,
    number: 107,
    name: "Vodka Gorbatschow",
    description: "0,7 L",
    price: 16.00
  }
];

// Hamburger (Burgers) - Completely updated with new items and patty size options
export const fleischgerichte: MenuItem[] = [
  {
    id: 529,
    number: 1,
    name: "Fleischgericht Tasche",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen im Fladenbrot, gemischtem Salat & Soße",
    price: 7.50,
    isSpezialitaet: true
  },
  {
    id: 530,
    number: 2,
    name: "Fleischgericht Dürüm",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, gemischtem Salat & Soße",
    price: 8.50,
    isSpezialitaet: true
  },
  {
    id: 531,
    number: 3,
    name: "Fleischgericht Box",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Pommes frites & Soße",
    price: 7.50,
    isSpezialitaet: true
  },
  {
    id: 532,
    number: 4,
    name: "Fleischgericht Teller (mit Pommes)",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Pommes frites oder Bulgur & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 533,
    number: 5,
    name: "Fleischgericht (mit Salat)",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 534,
    number: 6,
    name: "Sucuk Tasche",
    description: "mit türkischer Knoblauchwurst im Fladenbrot, mit gemischtem Salat & Soße",
    price: 9.00,
    isSpezialitaet: true
  },
  {
    id: 535,
    number: 7,
    name: "Sucuk Teller",
    description: "mit türkischer Knoblauchwurst mit Bulgur oder Pommes, mit gemischtem Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 536,
    number: 8,
    name: "Lahmacun Salat",
    description: "frischer Lahmacun gefüllt mit Lahmacun & Soße",
    price: 6.00,
    isSpezialitaet: true
  },
  {
    id: 537,
    number: 9,
    name: "Lahmacun Kalb oder Hähnchen",
    description: "Fleischgericht nach Wahl: Kalb oder Hähnchen mit gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 538,
    number: 10,
    name: "Lahmacun Weichkäse",
    description: "mit Weichkäse, gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  }
];

// Helper function to create pizza sizes with individual prices
const createPizzaSizes = (prices: { medium: number; large: number; family: number; mega: number }) => [
  { name: 'Medium', price: prices.medium, description: 'Ø ca. 26 cm' },
  { name: 'Large', price: prices.large, description: 'Ø ca. 30 cm' },
  { name: 'Family', price: prices.family, description: 'Ø ca. 40 cm' },
  { name: 'Mega', price: prices.mega, description: 'Ø ca. 50 cm' }
];

// Pizza - Updated with new Döner Pizza and updated Wunsch Pizza ingredients
export const pizzas: MenuItem[] = [
  {
    id: 526,
    number: 26,
    name: "Pizza Margherita",
    description: "",
    price: 9.00,
    isPizza: true
  },
  {
    id: 527,
    number: 27,
    name: "Pizza Salami",
    description: "mit Salami",
    price: 10.00,
    isPizza: true
  },
  {
    id: 528,
    number: 28,
    name: "Pizza Schinken",
    description: "mit Schinken",
    price: 10.00,
    isPizza: true
  },
  {
    id: 529,
    number: 29,
    name: "Pizza Funghi",
    description: "mit Champignons",
    price: 10.00,
    isPizza: true
  },
  {
    id: 530,
    number: 30,
    name: "Pizza Tonno",
    description: "mit Thunfisch & Zwiebeln",
    price: 11.00,
    isPizza: true
  },
  {
    id: 531,
    number: 31,
    name: "Pizza Sucuk",
    description: "mit Knoblauchwurst",
    price: 11.00,
    isPizza: true
  },
  {
    id: 532,
    number: 32,
    name: "Pizza Hollandaise",
    description: "mit Hähnchenbrusfilet, Broccoli, Tomaten, Hollandaise-Soße",
    price: 12.00,
    isPizza: true
  },
  {
    id: 533,
    number: 33,
    name: "Pizza Hawaii",
    description: "mit Ananas & Schinken",
    price: 12.00,
    isPizza: true
  },
  {
    id: 534,
    number: 34,
    name: "Pizza Athen",
    description: "mit Spinat & Weichkäse",
    price: 12.00,
    isPizza: true
  },
  {
    id: 535,
    number: 35,
    name: "Pizza Rio",
    description: "mit Sucuk, Weichkäse, Zwiebeln & Peperoni",
    price: 12.50,
    isPizza: true
  },
  {
    id: 536,
    number: 36,
    name: "Calzone",
    description: "mit 3 Zutaten nach Wahl, jede extra Zutat +1 €",
    price: 12.00,
    isPizza: true
  },
  {
    id: 537,
    number: 37,
    name: "Pizza Art Drehspieß",
    description: "mit Fleischgericht nach Wahl & Zwiebeln",
    price: 12.50,
    isPizza: true
  },
  {
    id: 538,
    number: 38,
    name: "Pizza Hamburger",
    description: "mit Hamburger-Patty, Salat, jede extra Zutat +1 €, Burgersoße",
    price: 12.00,
    isPizza: true
  },
  {
    id: 539,
    number: 39,
    name: "Pizza Mozzarella",
    description: "mit frischem Mozzarella & Tomaten",
    price: 12.00,
    isPizza: true
  },
  {
    id: 540,
    number: 40,
    name: "Pizza Italia",
    description: "mit Salami, Mozzarella & frischem Basilikum",
    price: 11.00,
    isPizza: true
  },
  {
    id: 541,
    number: 41,
    name: "Pizza Rustica",
    description: "mit Schinken, Salami & frischen Champignons",
    price: 11.00,
    isPizza: true
  },
  {
    id: 542,
    number: 42,
    name: "Pizza Grüne Oase",
    description: "mit Paprika, Tomaten, Broccoli & Champignons",
    price: 12.00,
    isPizza: true
  },
  {
    id: 543,
    number: 43,
    name: "Pizza Mexico",
    description: "mit Jalapenos, Hähnchenfleisch, Mais, Paprika & Champignons",
    price: 12.00,
    isPizza: true
  },
  {
    id: 544,
    number: 44,
    name: "Pizza Quattro Stagioni",
    description: "mit Schinken, Salami, Champignons & Artischocken",
    price: 12.00,
    isPizza: true
  },
  {
    id: 545,
    number: 45,
    name: "Pizza India",
    description: "mit Schinken, Hähnchenbrusfilet, Ananas & Currysauce",
    price: 12.00,
    isPizza: true
  },
  {
    id: 546,
    number: 46,
    name: "Pizza Diavolo",
    description: "mit Salami, Champignons & Peperoni",
    price: 12.50,
    isPizza: true
  },
  {
    id: 547,
    number: 47,
    name: "Pizza Brötchen",
    description: "jede extra Zutat +1 €",
    price: 5.00,
    isPizza: true
  }
];