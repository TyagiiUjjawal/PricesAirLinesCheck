const express = require("express");
const app = express();
const port = 3000;
const amadeus = require("amadeus");
const ejs = require("ejs");

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", "./views"); // Set the views directory

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("search-form");
});

app.post("/", (req, res) => {
  const { source, destination, date } = req.body;
  const amadeusClient = new amadeus({
    clientId: "cLvoqYgmhIkElLTAzAKMJfHYUBjbpTDx",
    clientSecret: "Ix7Ep7ZwVfiDhYEu",
  });

  const params = {
    originLocationCode: source,
    destinationLocationCode: destination,
    departureDate: date,
    adults: 1,
    currencyCode: "INR",
  };
  amadeusClient.shopping.flightOffersSearch
    .get(params)
    .then(function (response) {
      const flightPrices = {};

      response.data.forEach(function (flightOffer) {
        flightPrices[flightOffer.validatingAirlineCodes[0]] =
          flightOffer.price.total;
      });
      const data = { message1: source, message2: destination };
      res.render("flight-prices", { flightPrices, data: data }); // Pass data to the view
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
