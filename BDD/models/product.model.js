import { ProductSize } from "./models/productsize.model.js";

export class ProductModel{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS product(
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_name VARCHAR(255),
            product_price DOUBLE,
            product_theme VARCHAR(255),
            product_desc TINYTEXT
        )`).catch(console.error);
    }

    async getAllProducts(){
        const [products] = await this.client.execute(`SELECT * FROM product`).catch(console.error);
        return products;
    }

    async getProductSize(){
        const productSize = new ProductSize(this.client);
        return await productSize.getAllSizes();
    }

    async addProduct(product_name,product_price,product_theme,product_desc){
        const [insertProduct] = await this.client.execute(`INSERT INTO product (product_name,product_price,product_theme,product_desc) VALUES (?,?,?,?)`,[product_name,product_price,product_theme,product_desc]).catch(console.error);
        return insertProduct;
    }

    async getProductById(id) {
        const [products] = await this.client.execute(
            'SELECT * FROM product WHERE id = ?',
            [id]
        ).catch(console.error);
        return products[0];
    }

    async updateProduct(id, product_name, product_price, product_theme, product_desc) {
        const [result] = await this.client.execute(
            'UPDATE product SET product_name = ?, product_price = ?, product_theme = ?, product_desc = ? WHERE id = ?',
            [product_name, product_price, product_theme, product_desc, id]
        ).catch(console.error);
        return result;
    }

    async deleteProduct(id) {
        const [result] = await this.client.execute(
            'DELETE FROM product WHERE id = ?',
            [id]
        ).catch(console.error);
        return result;
    }

    async searchProducts(theme, minPrice, maxPrice) {
        let query = 'SELECT * FROM product WHERE 1=1';
        const params = [];

        if (theme) {
            query += ' AND product_theme LIKE ?';
            params.push(`%${theme}%`);
        }

        if (minPrice) {
            query += ' AND product_price >= ?';
            params.push(minPrice);
        }

        if (maxPrice) {
            query += ' AND product_price <= ?';
            params.push(maxPrice);
        }

        const [products] = await this.client.execute(query, params).catch(console.error);
        return products;
    }
}