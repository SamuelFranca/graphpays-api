import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Neo4jTypeInterceptor } from './../src/neo4j/neo4j-type.interceptor';
import { Neo4jErrorFilter } from './../src/neo4j/neo4j-error.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new Neo4jTypeInterceptor());
    app.useGlobalFilters(new Neo4jErrorFilter());

    await app.init();
  });

  afterEach(() => app.close());

  //it('/ (GET)', () => {
  //  return request(app.getHttpServer())
  //    .get('/')
  //    .expect(200)
  //    .expect( res => {
  //      console.log("/ (GET)")
  //      //expect(res.body.message).toContain('Hello neo4j')

  //      console.log(res.body.messages)
  //    });
  //});

  describe('Auth', () => {
    const email = `${Math.random()}@samuelfranca.pt`;
    const password = Math.random().toString();
    let token, genreId;

    //  afterAll(() => app.get(Neo4jService).write(`
    //    MATCH (u:User {email: $email})
    //    FOREACH (s IN [ (u)-[:PURCHASED]->(s) ] | DETACH DELETE s)
    //    DETACH DELETE u
    //  `,{ email })
    //  )

    describe('POST /auth/register', () => {
       it('should validade the request', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            email: 'hello@example.com',
            taxId: 13545666,
            country: 'Portugal'
          })
          .expect(400)
          .expect((res) => {
            //console.log(res.body);
            expect(res.body.message).toContain('password should not be empty');
          });
      }); 

      it('should return HTTP 200 successful on successful registration', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            email,
            password,
            taxId: 14587525,
            country: 'Portugal'
          })
          .expect(201)
          .expect((res) => {
            //console.log('result:');
            //console.log(res.body);
            expect(res.body.access_token).toBeDefined();
          });
      });
 
       it('should return HTTP 400 when email is already taken', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            email,
            password,
            taxId: 14587525,
            country: 'Portugal'
          })
          .expect(400)
          .expect((res) => {
            //console.log(res.body);
            expect(res.body.message).toContain('email already taken');
          });
      });  
    });

     describe('POST /auth/login', () => {
      it('should return 401 if username does not exist', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'unknown', password: 'anything' })
          .expect(401);
      });
      it('should return 401 if password is incorrect', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password: 'anything' })
          .expect(401);
      });

      it('should return 201 if username and password are correct', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(201)
          .expect((res) => {
            expect(res.body.access_token).toBeDefined();
            token = res.body.access_token;
            //console.log(res.body);
          });
      });
    }); 
 

    
    describe('GET /auth/user', () => {
      it('should return unauthorised if no token is provided', () => {
        return request(app.getHttpServer()).get('/auth/user').expect(401);
      });

      it('should return unauthorised on incorrect token', () => {
        return request(app.getHttpServer())
          .get('/auth/user')
          .set('Authorization', `Bearer incorrect`)
          .expect(401);
      });

      it('should authenticate a user with the JWT token', () => {
        return request(app.getHttpServer())
          .get('/auth/user')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toBe(email);
            expect(res.body.password).toBeUndefined();
          });
      });
    });
   });
});
