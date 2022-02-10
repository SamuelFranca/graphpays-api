import { Injectable } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Injectable()
export class AppService {
  static getHello() {
    throw new Error('Method not implemented.');
  }

  constructor(private readonly neo4jService: Neo4jService) {}

  async getHello(): Promise<string> {
    const result = await this.neo4jService.read('MATCH (n) RETURN count(n) as count',{})

    const count = result.records[0].get('count')

    return `Hello neo4j User! There are ${count} nodes in the database`;
  }
}