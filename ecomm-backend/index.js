const express = require("express");
const server = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
require("dotenv").config();
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const stripe = require('stripe')(process.env.Stripe_server_Key);
const path= require("path")


// const __dirname = path.resolve();

// JWT options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO: should not be in code;

//middlewares
server.use(bodyParser.json());
server.use(express.raw({type: 'application/json'}));
// server.use(express.static(path.resolve(__dirname,'build')));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.Session_key,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productsRouter.router);
// we can also use JWT token for client-only auth
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);


server.use(express.static(path.join(__dirname, "../ecomm-webapp-redux/build")));

server.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../ecomm-webapp-redux/build", "index.html"));
});

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user,"this is passport local");
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          user.token=token;
          done(null, { id: user.id, role: user.role ,token:user.token}); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload },"kaisa laga payload");
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log(err,"this comes from passport(jwt)")
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role ,token:user.token});
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Stripe payment configuration ---------------------------------------


server.post("/create-checkout-session", async (req, res) => {
  const { currentOrder, customerName, customerAddress } = req.body;

  console.log(currentOrder, customerName, customerAddress, "this is the body");

  const lineItems = currentOrder.items.map((item) => ({
    price_data: {
      currency: "INR",
      product_data: {
        name: item.product.title,
      },
      unit_amount: item.product.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    // Step 1: Create a Customer in Stripe with the required details
    const customer = await stripe.customers.create({
      name: customerName,
      address: {
       line1: currentOrder.selectedAddress.street,
        city: currentOrder.selectedAddress.city,
        postal_code: currentOrder.selectedAddress.pinCode,
        state: currentOrder.selectedAddress.state,
        country: "IN",
      },
    });

    // Step 2: Create a checkout session with the Customer ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer: customer.id, // Use the created customer
      success_url: `http://localhost:8080/order-success/${currentOrder.id}`,
      cancel_url: "http://localhost:8080",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});



server.get("/", (req, res) => {
  res.send("Hello World");
});


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGOURI);
  console.log("database connected");
}

server.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
