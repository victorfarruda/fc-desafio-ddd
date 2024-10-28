import { Sequelize } from "sequelize-typescript";

import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import Product from "../../../domain/product/entity/product";
import CustomerRepository from "../../customer/repository/customer.repository";
import CustomerModel from "../../customer/repository/sequelize/customer.model";
import ProductRepository from "../../product/repository/product.repository";
import ProductModel from "../../product/repository/sequelize/product.model";
import OrderRepository from "./order.repository";
import OrderItemModel from "./sequelize/order-item.model";
import OrderModel from "./sequelize/order.model";


describe("Customer repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel, OrderItemModel, OrderModel, CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("Should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {
                id: order.id,
            },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    product_id: "123",
                    order_id: "1"
                }
            ]
        });
    });


    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        let order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {
                id: order.id,
            },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    product_id: "123",
                    order_id: "1"
                }
            ]
        });

        const product2 = new Product("321", "Product 2", 15);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);
        order = new Order("1", customer.id, [orderItem, orderItem2]);

        await orderRepository.update(order);

        const orderModelUpdated = await OrderModel.findOne({
            where: {
                id: order.id,
            },
            include: ["items"]
        });

        expect(orderModelUpdated.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    product_id: "123",
                    order_id: "1"
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    product_id: "321",
                    order_id: "1"
                }
            ]
        });

    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        let order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("Should throw an error when order is not found", () => {
        const orderRepository = new OrderRepository();

        expect(async () => {
            await orderRepository.find("123456");
        }).rejects.toThrow("Order not found");
    });

    it("Should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        let order1 = new Order("1", customer1.id, [orderItem1]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);

        const customer2 = new Customer("321", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        const product2 = new Product("321", "Product 2", 25);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 5);
        let order2 = new Order("2", customer2.id, [orderItem2]);

        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);
    });

});
