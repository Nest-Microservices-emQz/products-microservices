import { HttpStatus, Injectable, Logger,OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { number } from 'joi';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('Product Service');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database conected')
  }
  create(createProductDto: CreateProductDto) {
    return  this.product.create({
      data: createProductDto
    })
  }

  async findAll(PaginationDto: PaginationDto) {
    const{ page, limit } = PaginationDto;

    const totalItems = await this.product.count({where: {available : true}});
    const lastPage = Math.ceil(totalItems / limit);

    return {
      data: await this.product.findMany({
        skip: (page -1) * limit,
        take: limit,
        where: {available: true}
      }),
      meta: {
        limit: limit,
        page : page,
        totalItems: totalItems,
        lastPage: lastPage
      }
    }

    // return this.product.findMany({
    //   skip: (page - 1) * limit,
    //   take: limit
    // })
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {id, available: true}
    });

    if(!product){
      throw new RpcException ({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const{ id: _, ...data } = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data : data
    });
  }

  async remove(id: number) {
    // return `This action removes a #${id} product`;
    await this.findOne(id);

    // return this.product.delete({
    //   where: { id }
    // });

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;
  }
}
