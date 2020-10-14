import {MyService} from "../../../types/base";
import {CreateProduct} from "../../../types/product";
import {getCustomRepository} from "typeorm";
import ProductRepository from "../../../repository/ProductRepository";
import existUser from "../../../utils/auth/existUser";

/**
 * 제품 등록 로직
 */
export const productCreateService: MyService = async (req, res) => {
  const {image, name, unit, description}: CreateProduct = req.body;
  const userId = req.session.userId;

  if (!name || !unit) {
    return res.status(400).json({
      errors: [{
        field: "etc",
        message: "제품명과 단위는 필수값 입니다.",
      }],
    });
  }

  const isUser = await existUser(req);
  if (isUser) {
    try {
      const productRepository = getCustomRepository(ProductRepository);
      const product = await productRepository.createProduct(userId, name, unit, image, description);
      return res.status(201).json({
        product,
      })
    } catch {
      return res.status(500).json({
        errors: [{
          field: "etc",
          message: "제품 등록에 실패하였습니다..",
        }],
      });
    }
  } else {
    return res.status(401).json({
      errors: [{
        field: "etc",
        message: "권한 없음.",
      }],
    });
  }
};

/**
 * 제품 조회 로직
 */
export const productListService: MyService = async (req, res) => {
  const {page, limit} = req.query;

  const isUser = await existUser(req);
  if (isUser) {
    try {
      const productRepository = getCustomRepository(ProductRepository);
      const products = await productRepository.getProductList(req.session.userId, page, limit)
      return res.status(200).json({
        products
      });
    } catch (error) {
      return res.status(500).json({
        errors: [{
          field: "etc",
          message: "알 수 없는 에러 발생.",
        }],
      });
    }
  }

  return res.status(401).json({
    errors: [{
      field: "etc",
      message: "권한 없음.",
    }],
  });
};
