import React, { useState } from 'react'

interface Props {
  min?: number
  max?: number
  step?: number
  value?: number
  onChange?: (value: number) => void
}

const CustomDecimalQuantity: React.FC<Props> = ({
  min = 0.001,
  max = 1000,
  step = 0.001,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(0.025);

  // Sync the custom value to the standard VTEX quantity input on every change
  React.useEffect(() => {
    const stdInput = document.querySelector('.vtex-numeric-stepper__input')
    if (stdInput) {
      (stdInput as HTMLInputElement).focus();
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(stdInput, internalValue.toString());
      stdInput.dispatchEvent(new Event('input', { bubbles: true }));
      stdInput.dispatchEvent(new Event('change', { bubbles: true }));
      (stdInput as HTMLInputElement).blur();
      // eslint-disable-next-line no-console
      console.log('Force-synced custom quantity to standard input:', internalValue)
    } else {
      // eslint-disable-next-line no-console
      console.warn('Standard VTEX quantity input not found!')
    }
  }, [internalValue]);

  React.useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      // Do nothing, always use 0.025
    }
  }, [value])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="custom-qty" style={{ marginRight: 8 }}>Quantity</label>
      <input
        id="custom-qty"
        className="custom-decimal-qty"
        type="number"
        min={min}
        max={max}
        step={step}
        value={internalValue}
        onChange={e => setInternalValue(parseFloat(e.target.value))}
        style={{ width: 80, textAlign: 'center' }}
      />
      <span>oz</span>
    </div>
  )
}

export default CustomDecimalQuantity; 