require("dotenv").config();
const Database = require("dbcmps369");
const { getHashed } = require("./routes/hashing");

class ContactsDB {
  constructor() {
    this.db = new Database();
  }

  async initialize() {
    await this.db.connect();

    await this.db.schema(
      "Users",
      [
        { name: "id", type: "INTEGER" },
        { name: "first_name", type: "TEXT" },
        { name: "last_name", type: "TEXT" },
        { name: "username", type: "TEXT" },
        { name: "password", type: "TEXT" },
      ],
      "id"
    );

    await this.db.schema(
      "Contact",
      [
        { name: "id", type: "INTEGER" },
        { name: "title", type: "TEXT"},
        { name: "first_name", type: "TEXT" },
        { name: "last_name", type: "TEXT" },
        { name: "phone_number", type: "TEXT" },
        { name: "email_address", type: "TEXT" },
        { name: "street", type: "TEXT" },
        { name: "city", type: "TEXT" },
        { name: "state", type: "TEXT" },
        { name: "zip", type: "TEXT" },
        { name: "country", type: "TEXT" },
        { name: "contact_by_phone", type: "INTEGER" },
        { name: "contact_by_email", type: "INTEGER" },
        { name: "contact_by_mail", type: "INTEGER" },
        { name: "lat", type: "numeric" },
        { name: "lng", type: "numeric" },
      ],
      "id"
    );

    const user = await this.findUserByUserName("cmps369");
    if (!user) {
      await this.createUser("admin", "admin", "cmps369", getHashed("rcnj"));
    }
  }

  async findUserByUserName(username) {
    const us = await this.db.read("Users", [
      { column: "username", value: username },
    ]);
    if (us.length > 0) return us[0];
    else {
      return undefined;
    }
  }

  async createUser(firstName, lastName, username, password) {
    const id = await this.db.create("Users", [
      { column: "password", value: password },
      { column: "first_name", value: firstName },
      { column: "last_name", value: lastName },
      { column: "username", value: username },
    ]);
    return id;
  }

  async createContact(
    title,
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
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
  ) {
    const id = await this.db.create("Contact", [
      { column: "title", value: title },
      { column: "first_name", value: firstName },
      { column: "last_name", value: lastName },
      { column: "phone_number", value: phoneNumber },
      { column: "email_address", value: emailAddress },
      { column: "street", value: street },
      { column: "city", value: city },
      { column: "state", value: state },
      { column: "zip", value: zip },
      { column: "country", value: country },
      { column: "contact_by_phone", value: contactByPhone },
      { column: "contact_by_email", value: contactByEmail },
      { column: "contact_by_mail", value: contactByMail },
      { column: "lat", value: lat},
      { column: "lng", value: lng},
    ]);
    return id;
  }

  async findUserById(id) {
    const us = await this.db.read("Users", [{ column: "id", value: id }]);
    if (us.length > 0) return us[0];
    else {
      return undefined;
    }
  }

  async getAllContacts() {
    const contacts = await this.db.read("Contact", []);
    return contacts;
  }

  async findContactById(id) {
    const us = await this.db.read("Contact", [{ column: "id", value: id }]);
    if (us.length > 0) return us[0];
    else {
      return undefined;
    }
  }

  async deleteContact(contactId) {
    await this.db.delete("Contact", [{ column: "id", value: contactId }]);
  }

  async updateContact(
    contactId,
    title,
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
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
  ) {
    await this.db.update(
      "Contact",
      [
        { column: "title", value: title },
        { column: "first_name", value: firstName },
        { column: "last_name", value: lastName },
        { column: "phone_number", value: phoneNumber },
        { column: "email_address", value: emailAddress },
        { column: "street", value: street },
        { column: "city", value: city },
        { column: "state", value: state },
        { column: "zip", value: zip },
        { column: "country", value: country },
        { column: "contact_by_phone", value: contactByPhone },
        { column: "contact_by_email", value: contactByEmail },
        { column: "contact_by_mail", value: contactByMail },
        { column: "lat", value: lat},
        { column: "lng", value: lng},
      ],
      [{ column: "id", value: contactId }]
    );
  }
}

module.exports = ContactsDB;
