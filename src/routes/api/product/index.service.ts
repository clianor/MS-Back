import {MyService} from "../../../types/base";
import {CreateProduct} from "../../../types/product";
import {getCustomRepository} from "typeorm";
import ProductRepository from "../../../repository/ProductRepository";
import UserRepository from "../../../repository/UserRepository";

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

  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findUser({id: userId});
  if (user) {
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
    })
  }
};
