import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    Typography,
    useTheme,
    IconButton,
    TextField
} from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import { ShopifyOrder } from '../services/shopifyService';
import { styled } from '@mui/material/styles';
import {
    StyledTableContainer,
    StyledTable,
    StyledTableRow,
    CurrencyCell,
    OrderIdText,
    DateText,
} from './shared/StyledTable';
import DateHeader from './shared/DateHeader';

interface ShopifyOrdersTableProps {
    orders: ShopifyOrder[];
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const getStatusColor = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        Paid: 'success',
        Pending: 'warning',
        Failed: 'error',
        Fulfilled: 'success',
        Unfulfilled: 'warning',
        Cancelled: 'error',
        Completed: 'success',
        Processing: 'warning',
    };
    return statusMap[status] || 'default';
};

const StatusChip = styled(Chip)(({ status }: { status: string }) => ({
    borderRadius: '4px',
    height: '24px',
    backgroundColor: status === 'Unfulfilled' ? '#fb8c00' : '#81c784',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    marginRight: '8px',
}));

export const ShopifyOrdersTable: React.FC<ShopifyOrdersTableProps> = ({ orders }) => {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = React.useState('2024-03-15');

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <Box>
            <DateHeader 
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <StyledTableContainer>
                <StyledTable size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order Details</TableCell>
                            <TableCell align="right">Items</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right">Discount</TableCell>
                            <TableCell align="right">Shipping</TableCell>
                            <TableCell align="right">Tax</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <StyledTableRow key={order.orderId}>
                                <TableCell>
                                    <OrderIdText>{order.orderId}</OrderIdText>
                                    <DateText>{order.orderDate}</DateText>
                                    {order.discountCode && (
                                        <Box sx={{ color: 'text.secondary', fontSize: '12px' }}>
                                            Promo: {order.discountCode}
                                        </Box>
                                    )}
                                </TableCell>
                                <CurrencyCell>{order.itemsCount}</CurrencyCell>
                                <CurrencyCell>${order.subtotal.toFixed(2)}</CurrencyCell>
                                <CurrencyCell>${order.discountAmount.toFixed(2)}</CurrencyCell>
                                <CurrencyCell>${order.shipping.toFixed(2)}</CurrencyCell>
                                <CurrencyCell>${order.tax.toFixed(2)}</CurrencyCell>
                                <CurrencyCell>${order.total.toFixed(2)}</CurrencyCell>
                                <TableCell>
                                    <StatusChip 
                                        label={order.paymentStatus} 
                                        status={order.paymentStatus}
                                    />
                                    <StatusChip 
                                        label={order.fulfillmentStatus} 
                                        status={order.fulfillmentStatus}
                                    />
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
        </Box>
    );
};

export default ShopifyOrdersTable; 