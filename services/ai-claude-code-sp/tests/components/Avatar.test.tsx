import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="John Doe" />)
    const avatar = screen.getByText("J")
    expect(avatar).toBeInTheDocument()
  })

  it("displays first letter of single word name", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("displays first two uppercase letters from PascalCase name", () => {
    render(<Avatar name="JohnSmith" />)
    expect(screen.getByText("JS")).toBeInTheDocument()
  })

  it("displays first letter of multi-word name with spaces", () => {
    render(<Avatar name="Bob Johnson" />)
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
