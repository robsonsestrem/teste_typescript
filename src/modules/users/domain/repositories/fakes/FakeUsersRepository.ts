import { v4 as uuidv4 } from 'uuid';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { IPaginateUser } from '../../models/IPaginateUser';

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = new User();

    user.id = uuidv4();
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id
    );

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: User): Promise<void> {
    this.users = this.users.filter((u) => u.id !== user.id);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const data = this.users.slice(skip, skip + take);
    return {
      per_page: take,
      total: this.users.length,
      current_page: page,
      data,
    };
  }

  public async findByName(name: string): Promise<User | null> {
    return this.users.find((user) => user.name === name) ?? null;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }
}

export default FakeUsersRepository;
