import Order from "../../domain/checkout/entity/order";
import OrderItem from "../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            }))
        },
            {
                include: [{ model: OrderItemModel }]
            });
    }
    async update(entity: Order): Promise<void> {
        const order = await OrderModel.findByPk(entity.id, {
            include: ["items"],
        });
        await order.update({
            total: entity.total(),
        })
            .then(() => {
                OrderItemModel.bulkCreate(
                    entity.items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        order_id: entity.id,
                        product_id: item.productId,
                    })),
                    {
                        updateOnDuplicate: ["name", "price", "quantity", "product_id"],
                    }
                );
            });
    };

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({ where: { id }, include: ["items"], rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Order not found");
        }

        const order = new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(item => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ))
        );
        return order;
    }
    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({ include: ["items"] });

        const orders = ordersModel.map((orderModel) => {
            const order = new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map(item => new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                ))
            );
            return order;
        });
        return orders;
    }
}
