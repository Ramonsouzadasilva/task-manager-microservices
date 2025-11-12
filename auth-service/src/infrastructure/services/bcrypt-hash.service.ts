import bcrypt from "bcryptjs"
import type { IHashService } from "../../application/services/hash.service"

export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
