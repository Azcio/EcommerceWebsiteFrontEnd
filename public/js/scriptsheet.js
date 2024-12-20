var webstore = new Vue({
  el: "#app",
  data: {
    products: [],
    sitename: "Creative Corner",
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
    serverBaseURL: "https://ecommercewebsitebackend-119l.onrender.com",
    filterCriteria: [],
    sortOrder: [],
  },
  created() {
    this.fetchLessons();
    console.log("Products:", this.products);
console.log("Filtered Products:", this.filteredProducts);
  },

  watch: {
    // Watch for changes to the products array (should fetch all 17 products data)
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

    // watch any new changes to filter Products, e.g, will update if user changes filter and sorting order
    filteredProducts(newFilteredProducts) {
      console.log("Filtered Products Updated:", newFilteredProducts);
    }
  },
  methods: {
     async fetchLessons() {
      try {
        const response = await fetch(`${this.serverBaseURL}/collections/products`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          this.products = data; // Assign to fetched products to the data
          console.log("Fetched products:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = []; // Fallback to empty products array if error occurs
      }
      console.log("Check if the Products are in after fetch:", this.products);
    },


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
          `${this.serverBaseURL}/collections/orderInfo`,
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
  },

  computed: {
    filteredProducts: function () {
      let sortedProducts = [...this.products];

      // Sort by selected
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

        //function to sort subjects and location alphabetically
      } else if (this.filterCriteria.includes("subject")) {
        sortedProducts.sort((a, b) => {
          if (this.sortOrder === "ascending")
            return a.title.localeCompare(b.title);
          if (this.sortOrder === "descending")
            return b.title.localeCompare(a.title);
          return 0;
        });
      } else if (this.filterCriteria.includes("location")) {
        sortedProducts.sort((a, b) => {
          if (a.location && b.location) {
            return this.sortOrder === "ascending"
              ? a.location.localeCompare(b.location)
              : b.location.localeCompare(a.location);
          }
        });
      }

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
      if (!Array.isArray(this.products) || !Array.isArray(this.cart)) {
        return [];  
      }
      return this.products.filter((product) => this.cart.includes(product.id));
    },
  },
});