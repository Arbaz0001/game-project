import axios from 'axios'
import { useState } from 'react'

const Payment = () => {
    const [amount, setAmount] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [contact, setContact] = useState()

    const upiCheckoutHandler = async () => {
        const { data: { order } } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upi/checkout`, {
            amount: amount
        })

        const options = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            currency: "INR",
            name: "Gambling Website",
            description: "Ammount added using upi",
            amount: order.amount,
            order_id: order.id,
            callback_url: `${import.meta.env.VITE_API_URL}/api/v1/upi/paymentverification`,
            prefill: {
                name,
                email,
                contact
            },
            theme: {
                color: '#F37254'
            },
        };

        const razor = new Razorpay(options);
        razor.open();
    }

    const cryptoHandler = async () => {

    }

    return (
        <div>Payment</div>
    )
}

export default Payment