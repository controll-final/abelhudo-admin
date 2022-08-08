
import { Product } from '../@types/Product';
import Service from '../Service';
import generateQueryString from '../utils/generateQueryString';
import OAuthService from './OAuth.service';

class ProductService extends Service {
  static async getAllProducts(search: Product.Query) {
    const token = await OAuthService.getAuthorizationToken();

    const queryString = generateQueryString(search);
    return this.Http.get<Product.Paginated>("/v1/products".concat(queryString),
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
      }).then(this.getData);
  }

}

export default ProductService;

