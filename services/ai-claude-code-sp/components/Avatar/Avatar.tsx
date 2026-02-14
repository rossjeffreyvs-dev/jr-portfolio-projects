import styles from "./Avatar.module.css"

interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  const getInitials = (name: string): string => {
    // Check if name is PascalCase (has multiple uppercase letters with no spaces)
    const uppercaseLetters = name.match(/[A-Z]/g)
    const hasSpaces = name.includes(" ")

    if (!hasSpaces && uppercaseLetters && uppercaseLetters.length >= 2) {
      // PascalCase: return first two uppercase letters
      return uppercaseLetters.slice(0, 2).join("")
    }

    // Otherwise, return first character
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className={styles.avatar}>
      {getInitials(name)}
    </div>
  )
}
