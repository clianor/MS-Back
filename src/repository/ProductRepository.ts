import {EntityRepository, Repository} from "typeorm";
import Product from "../entities/Product";

@EntityRepository(Product)
class ProductRepository extends Repository<Product> {
  /**
   * 제품 생성
   */
  async createProduct(userId: string, productName: string, productUnit: string, image: string | undefined, productDescription: string | undefined): Promise<Product> {
    const product = this.create();
    product.name = productName;
    product.unit = productUnit;
    product.image = image;
    product.description = productDescription;
    product.userId = userId;
    return await this.save(product);
  }
}

export default ProductRepository;
