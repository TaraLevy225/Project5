const express = require("express");
const router = express.Router();
const geo = require("node-geocoder");
const geocoder = geo({ provider:"openstreetmap"});

const logged_in = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Not authorized");
  }
};

router.get("/", async (req, res) => {
  try {
    const contacts = await req.db.getAllContacts();
    res.render("contacts", { contacts: contacts, user: req.session.user });
  } catch (error) {
    res.status(500).send("Error fetching contacts");
  }
});

router.get("/create", async (req, res) => {
  try {
    res.render("create");
  } catch (error) {
    res.status(500).send("Error rendering create page");
  }
});

router.post("/create", async (req, res) => {
    const {
      title,
      firstname,
      lastname,
      phone,
      email,
      street,
      city,
      state,
      zip,
      country,
    } = req.body;

    const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;

    const result = await geocoder.geocode(address);
    let lat, lng;
    if (result && result.length > 0) {
      const [firstResult] = result;
      lat = firstResult.latitude;
      lng = firstResult.longitude;
    } else {
      throw new Error("Address not found");
    }

    const contactByEmail = req.body.contactByEmail ? 1 : 0;
    const contactByPhone = req.body.contactByPhone ? 1 : 0;
    const contactByMail = req.body.contactByMail ? 1 : 0;

    await req.db.createContact(
      title,
      firstname,
      lastname,
      phone,
      email,
      street,
      city,
      state,
      zip,
      country,
      contactByPhone,
      contactByEmail,
      contactByMail,
      lat,
      lng
    );

    res.redirect("/");
});


router.get("/:id", async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    if (contact !== undefined) {
      res.render("contact", { contact: contact });
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching contact");
  }
});

router.get("/:id/edit", logged_in, async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    if (contact !== undefined) {
      res.render("edit", { contact: contact });
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    res.status(500).send("Error rendering edit page");
  }
});

router.post("/:id/edit", logged_in, async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await req.db.findContactById(contactId);

    const {
      title,
      firstname,
      lastname,
      phone,
      email,
      street,
      city,
      state,
      zip,
      country,
    } = req.body;

    const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;

    const result = await geocoder.geocode(address);
    let lat, lng;
    if (result && result.length > 0) {
      const [firstResult] = result;
      lat = firstResult.latitude;
      lng = firstResult.longitude;
    } else {
      throw new Error("Address not found");
    }

    const contactByEmail = req.body.contactByEmail ? 1 : 0;
    const contactByPhone = req.body.contactByPhone ? 1 : 0;
    const contactByMail = req.body.contactByMail ? 1 : 0;

    if (contact !== undefined) {
      await req.db.updateContact(
        contactId,
        title,
        firstname,
        lastname,
        phone,
        email,
        street,
        city,
        state,
        zip,
        country,
        contactByPhone,
        contactByEmail,
        contactByMail,
        lat,
        lng
      );

      res.redirect("/");
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    res.status(500).send("Error updating contact");
  }
});


router.get("/:id/delete", logged_in, async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    if (contact !== undefined) {
      res.render("delete", { contact: contact });
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    res.status(500).send("Error rendering delete page");
  }
});

router.post("/:id/delete", logged_in, async (req, res) => {
  try {
    await req.db.deleteContact(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting contact");
  }
});

router.get("*", (req, res) => {
  res.status(404).send("Invalid route");
});

module.exports = router;
