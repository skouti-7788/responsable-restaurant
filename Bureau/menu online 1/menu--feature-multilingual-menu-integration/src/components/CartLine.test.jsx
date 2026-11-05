import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CartLine from './CartLine'

const line = {
  id: 1,
  name: 'Cheeseburger',
  image: '/burger.jpg',
  notes: '',
  qty: 2,
  price: 10,
}

describe('CartLine', () => {
  it('renders the name, quantity and line total price', () => {
    render(<CartLine line={line} onInc={() => {}} onDec={() => {}} onNotes={() => {}} onRemove={() => {}} />)

    expect(screen.getByText('Cheeseburger')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('20.00')).toBeInTheDocument()
  })

  it('calls onInc with the line id when the plus button is clicked', () => {
    const onInc = vi.fn()
    render(<CartLine line={line} onInc={onInc} onDec={() => {}} onNotes={() => {}} onRemove={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /increase cheeseburger quantity/i }))

    expect(onInc).toHaveBeenCalledWith(1)
  })

  it('calls onDec with the line id when the minus button is clicked', () => {
    const onDec = vi.fn()
    render(<CartLine line={line} onInc={() => {}} onDec={onDec} onNotes={() => {}} onRemove={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /decrease cheeseburger quantity/i }))

    expect(onDec).toHaveBeenCalledWith(1)
  })

  it('calls onRemove with the line id when the remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<CartLine line={line} onInc={() => {}} onDec={() => {}} onNotes={() => {}} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: /remove cheeseburger/i }))

    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('calls onNotes with the line id and new text when typing a note', () => {
    const onNotes = vi.fn()
    render(<CartLine line={line} onInc={() => {}} onDec={() => {}} onNotes={onNotes} onRemove={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Add a note…'), { target: { value: 'No onions' } })

    expect(onNotes).toHaveBeenCalledWith(1, 'No onions')
  })
})
