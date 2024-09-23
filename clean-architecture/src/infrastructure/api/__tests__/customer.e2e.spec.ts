import { app, sequelize } from "../express";
import request from "supertest";
describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "john",
    });

    expect(response.status).toBe(500);
  });

  it("should list all customer", async () => {
    const response1 = await request(app)
      .post("/customer")
      .send({
        name: "John",
        address: {
          street: "Street 1",
          city: "City 1",
          number: 123,
          zip: "12345",
        },
      });

    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 123,
          zip: "12343",
        },
      });

    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);
    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("John");
    expect(customer.address.street).toBe("Street 1");
    expect(customer.address.city).toBe("City 1");
    expect(customer.address.number).toBe(123);
    expect(customer.address.zip).toBe("12345");

    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Jane");
    expect(customer2.address.street).toBe("Street 2");
    expect(customer2.address.city).toBe("City 2");
    expect(customer2.address.number).toBe(123);
    expect(customer2.address.zip).toBe("12343");

    const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      '<?xml version="1.0" encoding="UTF-8"?>'
    );
    expect(listResponseXML.text).toContain("<customers>");
    expect(listResponseXML.text).toContain("<customer>");
    expect(listResponseXML.text).toContain("<name>John</name>");
    expect(listResponseXML.text).toContain("<street>Street 1</street>");
    expect(listResponseXML.text).toContain("<city>City 1</city>");
    expect(listResponseXML.text).toContain("<number>123</number>");
    expect(listResponseXML.text).toContain("</customer>");
    expect(listResponseXML.text).toContain("<customer>");
    expect(listResponseXML.text).toContain("<name>Jane</name>");
    expect(listResponseXML.text).toContain("<street>Street 2</street>");
    expect(listResponseXML.text).toContain("<city>City 2</city>");
    expect(listResponseXML.text).toContain("<number>123</number>");
    expect(listResponseXML.text).toContain("</customer>");
    expect(listResponseXML.text).toContain("</customers>");
  });
});
