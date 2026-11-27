import { userRepository } from "@/repositories/reference-data"
import type { User } from "@/types/domain/reference-data"

export function getUsers(): User[] {
    return userRepository.getAll()
}