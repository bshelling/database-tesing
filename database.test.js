const mongoose = require('mongoose');
require('dotenv').config();



describe('Customer CRUD',() => {
    let connection;
    let database;
    const customers = mongoose.model("test_"+process.env.COLLECTION,mongoose.Schema({
        name: String,
        email: String
    }));


    beforeAll(async () => {
       
        connection = await mongoose.connect('mongodb://localhost:27017/'+process.env.DATABASE,{useNewUrlParser: true, useUnifiedTopology: true });
        db = mongoose.connection;
        const collection = "test_"+process.env.COLLECTION;
        await db.createCollection(collection);

    });

    afterAll(async () => {

        const collection = "test_"+process.env.COLLECTION;
        await db.dropCollection(collection);
        await db.close();
        await connection.close();

    });

    
    test("Add Customer POST /customers",async () => {

        const response = await customers.create({
            name: process.env.CUSTOMER_NAME,
            email: process.env.CUSTOMER_EMAIL
        });
        await response.save();
        expect(response.name).toBe(process.env.CUSTOMER_NAME);

    });

    test("All Customers GET /customers", async () => {

        const response = await customers.find({});
        expect(response.length).toBeGreaterThan(0);

    });

    test("Update Customer PUT /customers/:id", async() => {
      

        const response = await customers.updateOne({name: process.env.CUSTOMER_NAME},{email: process.env.CUSTOMER_EMAIL_ALT});
        const responseTwo = await customers.findOne({name: process.env.CUSTOMER_NAME});
        expect(responseTwo.email).toBe(process.env.CUSTOMER_EMAIL_ALT);
        

    });


    test("Delete Customer DELETE /customers/:id", async() => {
        
        const response = await customers.deleteOne({name: process.env.CUSTOMER_NAME});
        expect(response.ok).toBe(1);
      

    });

});