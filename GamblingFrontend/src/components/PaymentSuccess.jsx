import React from 'react'
import { useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
    const searchQuery = useSearchParams()[0]

    const referenceNum = searchQuery.get("reference")
  return (
    <div>
        <h2>PaymentSuccess</h2>
        <p>Reference No. {referenceNum}</p>
    </div>
  )
}

export default PaymentSuccess