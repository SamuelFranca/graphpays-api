import { Injectable, NotFoundException } from '@nestjs/common';
import { Node, Transaction, types } from 'neo4j-driver';
import { Neo4jService } from '../neo4j/neo4j.service';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly encryptionService: EncryptionService,
  ) {}

  private hydrate(res): User {
    if (!res.records.length) {
      return undefined;
    }

    const user = res.records[0].get('u');

    return new User(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const res = await this.neo4jService.read(
      `MATCH (u:User {email:$email}) return u`,
       { email },
    );

    return this.hydrate(res);
  }

  async create(
    databaseOrTransaction: string | Transaction,
    email: string,
    password: string,
    taxId: string,
    country: string,
  ): Promise<User> {
    const res = await this.neo4jService.write(
      `
          CREATE (u:User)
          SET u += $properties, u.id = randomUUID()
          RETURN u
      `,
      {
        properties: {
          email,
          password: await this.encryptionService.hash(password),
          taxId,
          country,
        }
      },
      databaseOrTransaction,
    );

    return this.hydrate(res);
  }
}
