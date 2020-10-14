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

  /**
   * 제품 리스트 (pagination)
   */
  async getProductList(userId: string, page: number = 0, limit: number = 10): Promise<Product[] | undefined> {
    console.log(page, limit);
    const products = await this.createQueryBuilder("product")
      .select("product.id", "id")
      .addSelect("product.name", "name")
      .addSelect("product.unit", "unit")
      .addSelect("product.description", "description")
      .addSelect("product.image", "image")
      .addSelect("product.createdAt", "createdAt")
      .where("product.userId = :userId", {userId})
      .take(limit)
      .skip(page)
      .getRawMany();
    return products;
  }
}

export default ProductRepository;
