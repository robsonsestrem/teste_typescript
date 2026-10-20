import { v4 as uuidv4 } from 'uuid';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import {
  ICustomersRepository,
  SearchParams,
} from '@modules/customers/domain/repositories/ICustomersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { ICustomerPaginate } from '../../models/ICustomerPaginate';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      (findCustomer) => findCustomer.id === customer.id
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: Customer): Promise<void> {
    this.customers = this.customers.filter((c) => c.id !== customer.id);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<ICustomerPaginate> {
    const data = this.customers.slice(skip, skip + take);
    return {
      per_page: take,
      total: this.customers.length,
      current_page: page,
      data,
    };
  }

  public async findByName(name: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.name === name) ?? null;
  }

  public async findById(id: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.email === email) ?? null;
  }
}

export default FakeCustomersRepository;
