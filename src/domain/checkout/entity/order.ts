import OrderItem from "./order_item";

export default class Order {
    private _id: string;
    private _costumerId: string;
    private _items: OrderItem[];
    private _total: number;

    constructor(id: string, costumerId: string, items: OrderItem[]) {
        this._id = id;
        this._costumerId = costumerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._costumerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    validate(): boolean { 
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._costumerId.length === 0) {
            throw new Error("CustomerId is required");
        }
        if (this._items.length === 0) {
            throw new Error("Items are required");
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error("Quantity must be grater than 0")
        }
        return true;
    }
    
    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }
}