import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from './ProductCard'

const item = {
  id: 1,
  name: 'Cheeseburger',
  description: 'Beef patty with cheddar',
  price: 12.5,
  image: '/burger.jpg',
  tags: [],
}

describe('ProductCard', () => {
  it('renders the item name, description and formatted price', () => {
    render(<ProductCard item={item} qtyInCart={0} onOpen={() => {}} onQuickAdd={() => {}} index={0} />)

    expect(screen.getByText('Cheeseburger')).toBeInTheDocument()
    expect(screen.getByText('Beef patty with cheddar')).toBeInTheDocument()
    expect(screen.getByText('12.50')).toBeInTheDocument()
  })

  it('does not show a quantity pill when qtyInCart is zero', () => {
    render(<ProductCard item={item} qtyInCart={0} onOpen={() => {}} onQuickAdd={() => {}} index={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows the quantity pill when the item is already in the cart', () => {
    render(<ProductCard item={item} qtyInCart={3} onOpen={() => {}} onQuickAdd={() => {}} index={0} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onOpen with the item when the card is clicked', () => {
    const onOpen = vi.fn()
    render(<ProductCard item={item} qtyInCart={0} onOpen={onOpen} onQuickAdd={() => {}} index={0} />)

    fireEvent.click(screen.getByText('Cheeseburger'))

    expect(onOpen).toHaveBeenCalledWith(item)
  })

  it('calls onQuickAdd without triggering onOpen when the add button is clicked', () => {
    const onOpen = vi.fn()
    const onQuickAdd = vi.fn()
    render(<ProductCard item={item} qtyInCart={0} onOpen={onOpen} onQuickAdd={onQuickAdd} index={0} />)

    fireEvent.click(screen.getByRole('button', { name: /add cheeseburger to order/i }))

    expect(onQuickAdd).toHaveBeenCalledWith(item)
    expect(onOpen).not.toHaveBeenCalled()
  })
})
