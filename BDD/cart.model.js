export class Cart{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS cart(
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            product_id INT,
        )`).catch(console.error);
    }
    
    async getCart(){
        const [carts] = await this.client.execute(`SELECT * FROM cart`).catch(console.error);
        return carts;
    }

}