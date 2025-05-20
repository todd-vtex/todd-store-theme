import React, { useState, useEffect } from 'react'
import CustomDecimalQuantity from './CustomDecimalQuantity'

interface Props {
  skuId: string
  seller: string
}

const CustomDecimalQuantityAddToCart: React.FC<Props> = ({ skuId, seller }) => {
  const [quantity, setQuantity] = useState(0.001)
  const [loading, setLoading] = useState(false)

  // Move initialization logging to useEffect
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Component initialized with:', { skuId, seller, initialQuantity: quantity })
  }, []) // Empty dependency array means this runs once on mount

  const handleAddToCart = async () => {
    // eslint-disable-next-line no-console
    console.log('handleAddToCart called');
    setLoading(true)
    // eslint-disable-next-line no-console
    console.log('Add to cart clicked with:', { 
      currentQuantity: quantity,
      skuId,
      seller
    })

    try {
      // Get the current orderForm
      // eslint-disable-next-line no-console
      console.log('Fetching orderForm...')
      const orderFormRes = await fetch('/api/checkout/pub/orderForm', {
        credentials: 'same-origin',
      })
      const orderForm = await orderFormRes.json()
      const orderFormId = orderForm.orderFormId
      // eslint-disable-next-line no-console
      console.log('Got orderForm:', { orderFormId })

      const payload = {
        id: skuId,
        quantity: Math.round(quantity * 1000), // Convert to units (0.001 oz = 1 unit)
        seller: seller
      }

      // Debug log
      // eslint-disable-next-line no-console
      console.log('Sending add to cart payload:', payload)

      // Add item to cart
      // eslint-disable-next-line no-console
      console.log('Sending request to:', `/api/checkout/pub/orderForm/${orderFormId}/items`)
      const res = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          items: [payload],
        }),
      })

      if (!res.ok) {
        const errorBody = await res.text()
        // eslint-disable-next-line no-console
        console.error('Add to cart failed:', { 
          status: res.status, 
          statusText: res.statusText,
          errorBody 
        })
        throw new Error('Failed to add to cart: ' + errorBody)
      }

      const responseData = await res.json()
      // eslint-disable-next-line no-console
      console.log('Add to cart successful:', responseData)

      // Trigger cart update
      // eslint-disable-next-line no-console
      console.log('Dispatching cart update event')
      window.dispatchEvent(new CustomEvent('vtex:cartUpdated'))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Add to cart error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <CustomDecimalQuantity 
        value={quantity} 
        onChange={(newValue) => {
          // eslint-disable-next-line no-console
          console.log('Quantity changed:', { oldValue: quantity, newValue })
          setQuantity(newValue)
        }}
        min={0.001}
        max={1000}
        step={0.001}
      />
      <button 
        onClick={handleAddToCart} 
        disabled={loading}
        style={{ 
          padding: '8px 16px', 
          fontWeight: 'bold', 
          background: '#0f3e99', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default CustomDecimalQuantityAddToCart 