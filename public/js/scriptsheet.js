var webstore = new Vue({
  el: "#app",
  data: {
    sitename: "Creative Corner",
    siteLogo: "images/WebLogo.png",
    showHomePage: true,
    showProductPage: false,
    showCheckoutPage: false,
    products: products,
    cart: [],
    order: {
      name: "",
      surname: "",
      zip: "",
      number: "",
    },

    filterCriteria: [],
    sortOrder: [],
    lessons: [],

    imagesBaseURL: "https://erikcreativecorner.eu-west-2.elasticbeanstalk.com",
    serverBaseURL: "https://erikcreativecorner.eu-west-2.elasticbeanstalk.com",
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
      return products.Stock > this.cartCount(products.id);
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
      return products.Stock - this.cartCount(products.id);
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

      // fetch(
      //   "https://erikcreativecorner.eu-west-2.elasticbeanstalk.com/",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(orderData),
      //   }
      // )
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error("Failed to submit the order.");
      //     }
      //     return response.json();
      //   })
      //   .then((data) => {
      //     alert("Order submitted successfully!");
      //     console.log("Order saved with ID:", data.insertedId);
      //     // Reset form and cart
      //     this.order = { name: "", surname: "", zip: "", number: "" };
      //     this.cart = [];
      //     this.showHome();
      //   });
    },

    removeItemFromCart: function (productId) {
      const index = this.cart.indexOf(productId);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    fetchLessons() {
      // Fetch the product data
      fetch('https://erikcreativecorner.eu-west-2.elasticbeanstalk.com/collections/products')
        .then(response => response.json())
        .then(data => {
          // If the API returns an array, you can access the first product like this:
          this.products = data[0]; // Assuming we're dealing with the first product

          // Check if the product and its Image property exist
          if (this.products && this.products.Image) {
            console.log("Product image:", this.products.Image);
          } else {
            console.log("Product or Image is undefined");
          }
        })
        .catch(error => {
          console.error("Error fetching lessons from the Database:", error);
        });
    }
  //   async fetchLessons() {
  //     try {
  //       const response = await fetch(`${this.serverBaseURL}collections/products`);
  //       const data = await response.json();
  //       this.products = data;
  //       console.log("Fetched lessons:", this.products);
  //     } catch (error) {
  //       console.error("Error fetching lessons from the Database:", error);
  //     }
  //   },
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
      return this.products.filter((product) => this.cart.includes(product.id));
    },

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
          if (this.sortOrder === "ascending")
            return a.Location.localeCompare(b.Location);
          if (this.sortOrder === "descending")
            return b.Location.localeCompare(a.Location);
          return 0;
        });
      }

      return sortedProducts;
    },
  },
  created() {
    this.fetchLessons();
  }
});
