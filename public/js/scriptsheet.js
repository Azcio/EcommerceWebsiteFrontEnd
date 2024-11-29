// var webstore = new Vue({
//   el: "#app",
//   data: {
//     sitename: "Creative Corner",
//     siteLogo: "images/WebLogo.png",
//     showHomePage: true,
//     showProductPage: false,
//     showCheckoutPage: false,
//     // products: products,
//     cart: [],
//     order: {
//       name: "",
//       surname: "",
//       zip: "",
//       number: "",
//     },
//     ImageURL: "https://ecommercewebsitebackend-119l.onrender.com/",
//     serverBaseURL: "https://ecommercewebsitebackend-119l.onrender.com",
//   // serverBaseURL: "http://127.0.0.1:3000",
//     filterCriteria: 'price',
//     sortOrder: 'ascending',
//     products: [],// The fetched products from MongoDB
//   },
//   created() {
//     this.fetchLessons();
//     console.log("Products:", this.products);
// console.log("Filtered Products:", this.filteredProducts);
//   },

//   watch: {
//     // Watch for changes to the 'products' array
//     products(newProducts) {
//       console.log("Updated Products:", newProducts);
//     },

//      // Watch for changes to filterCriteria and sortOrder and log sorted results
//      filterCriteria(newFilter) {
//       console.log("Filter Criteria Updated:", newFilter);
//       console.log("Sorted Products after Filter Change:", this.filteredProducts);
//     },

//     sortOrder(newSortOrder) {
//       console.log("Sort Order Updated:", newSortOrder);
//       console.log("Sorted Products after Sort Order Change:", this.filteredProducts);
//     },

//     // Optionally, you can also watch for changes to the filteredProducts directly
//     filteredProducts(newFilteredProducts) {
//       console.log("Filtered Products Updated:", newFilteredProducts);
//       // You can perform additional side effects here if necessary
//     }
//   },
//   methods: {
//      async fetchLessons() {
//       try {
//         const response = await fetch(`${this.serverBaseURL}/collections/products`, {
//           method: "GET",
//           credentials: "include",
//         });
  
//         const data = await response.json();
  
//         if (Array.isArray(data)) {
//           this.products = data; // Assign fetched products to the data
//           console.log("Fetched products:", data);
//         } else {
//           console.warn("Invalid data format from server:", data);
//           this.products = []; // Set to empty array if response is invalid
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         this.products = []; // Fallback to empty array if error occurs
//       }
//     },

//     showHome: function () {
//       this.showHomePage = true;
//       this.showProductPage = false;
//       this.showCheckoutPage = false;
//     },

//     showProduct: function () {
//       this.showHomePage = false;
//       this.showProductPage = true;
//       this.showCheckoutPage = false;
//     },

//     showCheckout: function () {
//       if (this.showProductPage) {
//         this.showProductPage = false;
//         this.showCheckoutPage = true;
//         this.showHomePage = false;
//       } else {
//         this.showProductPage = true;
//         this.showCheckoutPage = false;
//         this.showHomePage = false;
//       }
//     },

//     // fetchLessons() {
//     //   fetch(`${this.serverBaseURL}/collections/products`, {
//     //     method: "GET",
//     //     credentials: "include",
//     //   })
//     //     .then((response) => response.json())
//     //     .then((data) => {
//     //       // Ensure the data is in the expected format
//     //       if (Array.isArray(data)) {
//     //         this.products = data; 
//     //         console.log("Fetched products:", data);
//     //       } else {
//     //         console.warn("Invalid data format from server:", data);
//     //       }
//     //     })
//     //     .catch((error) => {
//     //       console.error("Error fetching products:", error);
//     //       this.products = []; // Fallback to empty array in case of error
//     //     });
//     // },
   
//     addItemToTheCart: function (products) {
//       this.cart.push(products.id);
//       console.log(this.cart);
//     },

//     CanBeAddedToCart(products) {
//       return products.stock > this.cartCount(products.id);
//     },

//     cartCount(id) {
//       let count = 0;
//       for (let i = 0; i < this.cart.length; i++) {
//         if (this.cart[i] === id) {
//           count++;
//         }
//       }
//       return count;
//     },

//     itemsLeft(products) {
//       return products.stock - this.cartCount(products.id);
//     },

//     async submitCheckoutForm() {
//       const orderData = {
//         name: this.order.name.trim(),
//         surname: this.order.surname.trim(),
//         zip: this.order.zip.trim(),
//         number: this.order.number.trim(),
//         lessonsBought: this.CheckoutItems.map((item) => ({
//           id: item.id,
//           title: item.title,
//           quantity: this.cartCount(item.id),
//           price: item.price,
//           location: item.Location,
//         })),
//       };

//       try {
//         const response = await fetch(
//           `${this.serverBaseURL}/submit-order`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(orderData),
//           }
//         );
//         if (!response.ok) throw new Error("Failed to submit the order.");
//         const data = await response.json();
//         alert("Order submitted successfully!");
//         console.log("Order saved with ID:", data.insertedId);
//         this.order = { name: "", surname: "", zip: "", number: "" };
//         this.cart = [];
//         this.showHome();
//       } catch (error) {
//         console.error("Error submitting the order:", error);
//       }
//     },

//     removeItemFromCart: function (productId) {
//       const index = this.cart.indexOf(productId);
//       if (index !== -1) {
//         this.cart.splice(index, 1);
//       }
//     },  
//   },

//   computed: {
// filteredProducts: function () {
//       // If products array is empty or not yet populated, return empty array
//       // if (!Array.isArray(this.products) || this.products.length === 0) {
//       //   console.log("No products available for filtering.");
//       //   return [];
//       // }
    
//       let sortedProducts = [...this.products];
//       // Apply filtering and sorting based on criteria
//       if (this.filterCriteria.includes("price")) {
//         sortedProducts.sort((a, b) => {
//           if (this.sortOrder.includes("ascending")) {
//             return a.price - b.price;
//           } else if (this.sortOrder.includes("descending")) {
//             return b.price - a.price;
//           }
//           return 0;
//         });
//       } else if (this.filterCriteria.includes("availability")) {
//         sortedProducts.sort((a, b) => {
//           const spacesLeftA = this.itemsLeft(a);
//           const spacesLeftB = this.itemsLeft(b);
//           if (this.sortOrder.includes("ascending")) {
//             return spacesLeftA - spacesLeftB;
//           } else if (this.sortOrder.includes("descending")) {
//             return spacesLeftB - spacesLeftA;
//           }
//           return 0;
//         });
//       } else if (this.filterCriteria.includes("subject")) {
//         sortedProducts.sort((a, b) => {
//           if (this.sortOrder === "ascending") return a.title.localeCompare(b.title);
//           if (this.sortOrder === "descending") return b.title.localeCompare(a.title);
//           return 0;
//         });
//       } else if (this.filterCriteria.includes("location")) {
//         sortedProducts.sort((a, b) => {
//           if (this.sortOrder === "ascending")
//             return a.Location.localeCompare(b.Location);
//           if (this.sortOrder === "descending")
//             return b.Location.localeCompare(a.Location);
//           return 0;
//         });
//       }
//       console.log("Sorted Products:", sortedProducts);

//       return sortedProducts;
//     },

//     basket: function () {
//       return this.cart.length || "";
//     },

//     ValidForm: function () {
//       return (
//         this.order.name.trim() !== "" &&
//         this.order.surname.trim() !== "" &&
//         this.order.number.trim() !== ""
//       );
//     },

//     EmptyCart: function () {
//       return this.cart.length === 0;
//     },

//     CheckoutItems: function () {
//       // return this.products.filter((product) => this.cart.includes(product.id));
//       return this.products.filter(product => this.cart.includes(product.id)) || [];
//     },

//     // filteredProducts: function () {
//     //   if (!Array.isArray(this.products)) {
//     //     return [];
//     //   }

//     //   let sortedProducts = [...this.products];

//     //   // Sort by selected
//     //   if (this.filterCriteria.includes("price")) {
//     //     sortedProducts.sort((a, b) => {
//     //       if (this.sortOrder.includes("ascending")) {
//     //         return a.price - b.price;
//     //       } else if (this.sortOrder.includes("descending")) {
//     //         return b.price - a.price;
//     //       }
//     //       return 0;
//     //     });
//     //   } else if (this.filterCriteria.includes("availability")) {
//     //     sortedProducts.sort((a, b) => {
//     //       const spacesLeftA = this.itemsLeft(a);
//     //       const spacesLeftB = this.itemsLeft(b);

//     //       if (this.sortOrder.includes("ascending")) {
//     //         return spacesLeftA - spacesLeftB;
//     //       } else if (this.sortOrder.includes("descending")) {
//     //         return spacesLeftB - spacesLeftA;
//     //       }
//     //       return 0;
//     //     });

//     //     //function to sort subjects and location alphabetically
//     //   } else if (this.filterCriteria.includes("subject")) {
//     //     sortedProducts.sort((a, b) => {
//     //       if (this.sortOrder === "ascending")
//     //         return a.title.localeCompare(b.title);
//     //       if (this.sortOrder === "descending")
//     //         return b.title.localeCompare(a.title);
//     //       return 0;
//     //     });
//     //   } else if (this.filterCriteria.includes("location")) {
//     //     sortedProducts.sort((a, b) => {
//     //       if (this.sortOrder === "ascending")
//     //         return a.Location.localeCompare(b.Location);
//     //       if (this.sortOrder === "descending")
//     //         return b.Location.localeCompare(a.Location);
//     //       return 0;
//     //     });
//     //   }

//     //   return sortedProducts;
//     // },
//   },
// });

var webstore = new Vue({
  el: "#app",
  data: {
    sitename: "Creative Corner",
    siteLogo: "images/WebLogo.png",
    showHomePage: true,
    showProductPage: false,
    showCheckoutPage: false,
    cart: [],
    order: {
      name: "",
      surname: "",
      zip: "",
      number: "",
    },
    ImageURL: "https://ecommercewebsitebackend-119l.onrender.com/",
    serverBaseURL: "https://ecommercewebsitebackend-119l.onrender.com",
    filterCriteria: 'price',
    sortOrder: 'ascending',
    products: [], // The fetched products from MongoDB
  },
  created() {
    this.fetchLessons();
    console.log("Products:", this.products);
    console.log("Filtered Products:", this.filteredProducts);
  },

  watch: {
    // Watch for changes to the 'products' array
    products(newProducts) {
      console.log("Updated Products:", newProducts);
    },

    // Watch for changes to filterCriteria and sortOrder and log sorted results
    filterCriteria(newFilter) {
      console.log("Filter Criteria Updated:", newFilter);
      console.log("Sorted Products after Filter Change:", this.filteredProducts);
    },

    sortOrder(newSortOrder) {
      console.log("Sort Order Updated:", newSortOrder);
      console.log("Sorted Products after Sort Order Change:", this.filteredProducts);
    },

    filteredProducts(newFilteredProducts) {
      console.log("Filtered Products Updated:", newFilteredProducts);
    }
  },

  methods: {
    // Fetch lessons from the API
    async fetchLessons() {
      try {
        const response = await fetch(`${this.serverBaseURL}/collections/products`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          this.products = data; // Assign fetched products to the data
          console.log("Fetched products:", data);
        } else {
          console.warn("Invalid data format from server:", data);
          this.products = []; // Set to empty array if response is invalid
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = []; // Fallback to empty array if error occurs
      }
    },

    // Switch to home page
    showHome: function () {
      this.showHomePage = true;
      this.showProductPage = false;
      this.showCheckoutPage = false;
    },

    // Switch to product page
    showProduct: function () {
      this.showHomePage = false;
      this.showProductPage = true;
      this.showCheckoutPage = false;
    },

    // Switch to checkout page
    showCheckout: function () {
      if (this.showProductPage) {
        this.showProductPage = false;
        this.showCheckoutPage = true;
        this.showHomePage = false;
      } else {
        this.showProductPage = true;
        this.showCheckoutPage = false;
        this.showHomePage = false;
      }
    },

    // Add item to the cart
    addItemToTheCart: function (product) {
      this.cart.push(product.id);
      console.log(this.cart);
    },

    // Check if item can be added to cart
    CanBeAddedToCart(product) {
      return product.stock > this.cartCount(product.id);
    },

    // Get the count of items in the cart
    cartCount(id) {
      return this.cart.filter(item => item === id).length;
    },

    // Get the number of items left in stock
    itemsLeft(product) {
      return product.stock - this.cartCount(product.id);
    },

    // Submit the checkout form
    async submitCheckoutForm() {
      const orderData = {
        name: this.order.name.trim(),
        surname: this.order.surname.trim(),
        zip: this.order.zip.trim(),
        number: this.order.number.trim(),
        lessonsBought: this.CheckoutItems.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: this.cartCount(item.id),
          price: item.price,
          location: item.Location,
        })),
      };

      try {
        const response = await fetch(`${this.serverBaseURL}/submit-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error("Failed to submit the order.");
        const data = await response.json();
        alert("Order submitted successfully!");
        console.log("Order saved with ID:", data.insertedId);
        this.order = { name: "", surname: "", zip: "", number: "" };
        this.cart = [];
        this.showHome();
      } catch (error) {
        console.error("Error submitting the order:", error);
      }
    },

    // Remove item from cart
    removeItemFromCart: function (productId) {
      const index = this.cart.indexOf(productId);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },
  },

  computed: {
    filteredProducts: function () {
      if (!Array.isArray(this.products) || this.products.length === 0) {
        console.log("No products available for filtering.");
        return [];
      }

      let sortedProducts = [...this.products];

      if (this.filterCriteria.includes("price")) {
        sortedProducts.sort((a, b) => {
          return this.sortOrder === "ascending" ? a.price - b.price : b.price - a.price;
        });
      } else if (this.filterCriteria.includes("availability")) {
        sortedProducts.sort((a, b) => {
          const spacesLeftA = this.itemsLeft(a);
          const spacesLeftB = this.itemsLeft(b);
          return this.sortOrder === "ascending" ? spacesLeftA - spacesLeftB : spacesLeftB - spacesLeftA;
        });
      } else if (this.filterCriteria.includes("subject")) {
        sortedProducts.sort((a, b) => {
          return this.sortOrder === "ascending" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        });
      } else if (this.filterCriteria.includes("location")) {
        sortedProducts.sort((a, b) => {
          return this.sortOrder === "ascending" ? a.Location.localeCompare(b.Location) : b.Location.localeCompare(a.Location);
        });
      }

      console.log("Sorted Products:", sortedProducts);
      return sortedProducts;
    },

    basket: function () {
      return this.cart.length || "";
    },

    ValidForm: function () {
      return (
        this.order.name.trim() !== "" &&
        this.order.surname.trim() !== "" &&
        this.order.number.trim() !== ""
      );
    },

    EmptyCart: function () {
      return this.cart.length === 0;
    },

    CheckoutItems: function () {
      return this.products.filter(product => this.cart.includes(product.id)) || [];
    },
  },
});
