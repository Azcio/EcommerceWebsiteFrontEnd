

var webstore = new Vue({
  el: "#app",
  data: {
    sitename: "Creative Corner",
    siteLogo: "images/WebLogo.png",
    showHomePage: true,
    showProductPage: false,
    showCheckoutPage: false,
    // products: products,
    cart: [],
    order: {
      name: "",
      surname: "",
      zip: "",
      number: "",
    },
    ImageURL: "https://ecommercewebsitebackend-119l.onrender.com/",
   serverBaseURL: "https://ecommercewebsitebackend-119l.onrender.com",
    filterCriteria: [],
    sortOrder: [],
    products: [],
  },
  methods: {
    showHome: function () {
      this.showHomePage = true;
      this.showProductPage = false;
      this.showCheckoutPage = false;
    },

    showProduct: function () {
      this.showHomePage = false;
      this.showProductPage = true;
      this.showCheckoutPage = false;
    },

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

    addItemToTheCart: function (products) {
      this.cart.push(products.id);
      console.log(this.cart);
    },

    CanBeAddedToCart(products) {
      return products.stock > this.cartCount(products.id);
    },

    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },

    itemsLeft(products) {
      return products.stock - this.cartCount(products.id);
    },

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
        const response = await fetch(
          `${this.serverBaseURL}/submit-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          }
        );
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

    removeItemFromCart: function (productId) {
      const index = this.cart.indexOf(productId);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    // fetchLessons() {
    //   fetch(`${this.serverBaseURL}/collections/products`, {
    //     method: 'GET',
    //     credentials: 'include',  // Include credentials (cookies)
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log('Fetched products:', data);
    //       if (Array.isArray(data)) {
    //         this.products = data;
    //       } else {
    //         console.warn("Invalid data format from server:", data);
    //         this.products = []; // Fallback to empty array
    //       }
    //     })
    //     //   this.products = data; // Assign fetched data to the products array
    //     // })
    //     .catch(error => console.error('Error:', error));
    //     this.products = [];
    // }

    fetchLessons() {
      fetch(`${this.serverBaseURL}/collections/products`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          // Ensure the data is in the expected format
          if (Array.isArray(data)) {
            this.products = data; 
            console.log("Fetched products:", data);
          } else {
            console.warn("Invalid data format from server:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          this.products = []; // Fallback to empty array in case of error
        });
    }
    
    
  },

  computed: {
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
      // return this.products.filter((product) => this.cart.includes(product.id));
      return this.products.filter(product => this.cart.includes(product.id)) || [];
    },

    // filteredProducts: function () {
    //   if (!Array.isArray(this.products)) {
    //     return [];
    //   }

    //   let sortedProducts = [...this.products];

    //   // Sort by selected
    //   if (this.filterCriteria.includes("price")) {
    //     sortedProducts.sort((a, b) => {
    //       if (this.sortOrder.includes("ascending")) {
    //         return a.price - b.price;
    //       } else if (this.sortOrder.includes("descending")) {
    //         return b.price - a.price;
    //       }
    //       return 0;
    //     });
    //   } else if (this.filterCriteria.includes("availability")) {
    //     sortedProducts.sort((a, b) => {
    //       const spacesLeftA = this.itemsLeft(a);
    //       const spacesLeftB = this.itemsLeft(b);

    //       if (this.sortOrder.includes("ascending")) {
    //         return spacesLeftA - spacesLeftB;
    //       } else if (this.sortOrder.includes("descending")) {
    //         return spacesLeftB - spacesLeftA;
    //       }
    //       return 0;
    //     });

    //     //function to sort subjects and location alphabetically
    //   } else if (this.filterCriteria.includes("subject")) {
    //     sortedProducts.sort((a, b) => {
    //       if (this.sortOrder === "ascending")
    //         return a.title.localeCompare(b.title);
    //       if (this.sortOrder === "descending")
    //         return b.title.localeCompare(a.title);
    //       return 0;
    //     });
    //   } else if (this.filterCriteria.includes("location")) {
    //     sortedProducts.sort((a, b) => {
    //       if (this.sortOrder === "ascending")
    //         return a.Location.localeCompare(b.Location);
    //       if (this.sortOrder === "descending")
    //         return b.Location.localeCompare(a.Location);
    //       return 0;
    //     });
    //   }

    //   return sortedProducts;
    // },

    filteredProducts: function () {
      // If products array is empty or not yet populated, return empty array
      if (!Array.isArray(this.products) || this.products.length === 0) {
        return [];
      }
    
      let sortedProducts = [...this.products];
    
      // Apply filtering and sorting based on criteria
      if (this.filterCriteria.includes("price")) {
        sortedProducts.sort((a, b) => {
          if (this.sortOrder.includes("ascending")) {
            return a.price - b.price;
          } else if (this.sortOrder.includes("descending")) {
            return b.price - a.price;
          }
          return 0;
        });
      } else if (this.filterCriteria.includes("availability")) {
        sortedProducts.sort((a, b) => {
          const spacesLeftA = this.itemsLeft(a);
          const spacesLeftB = this.itemsLeft(b);
          if (this.sortOrder.includes("ascending")) {
            return spacesLeftA - spacesLeftB;
          } else if (this.sortOrder.includes("descending")) {
            return spacesLeftB - spacesLeftA;
          }
          return 0;
        });
      } else if (this.filterCriteria.includes("subject")) {
        sortedProducts.sort((a, b) => {
          if (this.sortOrder === "ascending") return a.title.localeCompare(b.title);
          if (this.sortOrder === "descending") return b.title.localeCompare(a.title);
          return 0;
        });
      } else if (this.filterCriteria.includes("location")) {
        sortedProducts.sort((a, b) => {
          if (this.sortOrder === "ascending")
            return a.Location.localeCompare(b.Location);
          if (this.sortOrder === "descending")
            return b.Location.localeCompare(a.Location);
          return 0;
        });
      }
    
      return sortedProducts;
    }
    
  },
  created() {
    this.products = [];
    this.fetchLessons();
    console.log("Products:", this.products);
console.log("Filtered Products:", this.filteredProducts);
  },
  watch: {
    // Watch for changes to the 'products' array
    products(newProducts) {
      console.log("Updated Products:", newProducts);
    },
  },
});
