export interface ShopifyOrder {
    orderId: string;
    orderDate: string;
    customer: string;
    itemsCount: number;
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    shipping: number;
    tax: number;
    total: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    orderStatus: string;
}

// Mock data based on the CSV structure
export const getMockShopifyOrders = (): ShopifyOrder[] => {
    return [
        {
            orderId: 'SHF1000112',
            orderDate: '2024-03-15',
            customer: 'William Jones',
            itemsCount: 7,
            subtotal: 299.00,
            discountCode: 'BUNDLE25',
            discountAmount: 82.23,
            shipping: 10.22,
            tax: 17.38,
            total: 244.37,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Fulfilled',
            orderStatus: 'Open'
        },
        {
            orderId: 'SHF1000119',
            orderDate: '2024-03-15',
            customer: 'William Miller',
            itemsCount: 9,
            subtotal: 476.00,
            discountAmount: 0,
            shipping: 10.48,
            tax: 38.08,
            total: 524.56,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Open'
        },
        {
            orderId: 'SHF1000120',
            orderDate: '2024-03-15',
            customer: 'Emily Chen',
            itemsCount: 4,
            subtotal: 890.00,
            discountCode: 'TECH15',
            discountAmount: 133.50,
            shipping: 12.99,
            tax: 60.52,
            total: 830.01,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Open'
        },
        {
            orderId: 'SHF1000121',
            orderDate: '2024-03-15',
            customer: 'James Wilson',
            itemsCount: 6,
            subtotal: 245.00,
            discountCode: 'DECOR10',
            discountAmount: 24.50,
            shipping: 15.99,
            tax: 17.64,
            total: 254.13,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Fulfilled',
            orderStatus: 'Open'
        },
        {
            orderId: 'SHF1000122',
            orderDate: '2024-03-15',
            customer: 'Sophie Anderson',
            itemsCount: 3,
            subtotal: 178.00,
            discountCode: 'BEAUTY20',
            discountAmount: 35.60,
            shipping: 8.99,
            tax: 11.39,
            total: 162.78,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Fulfilled',
            orderStatus: 'Open'
        },
        {
            orderId: 'SHF1000123',
            orderDate: '2024-03-15',
            customer: 'Alex Thompson',
            itemsCount: 5,
            subtotal: 389.00,
            discountCode: 'SPRING25',
            discountAmount: 97.25,
            shipping: 11.99,
            tax: 23.34,
            total: 327.08,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Open'
        }
    ];
}; 