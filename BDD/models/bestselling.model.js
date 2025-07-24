

export class BestsellingModel{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS bestselling(
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_name VARCHAR(255),
            product_price DOUBLE,
            product_theme VARCHAR(255),
            product_desc TINYTEXT
        )`).catch(console.error);
    }

    async getAllBestselling(){
        const [bestsellings] = await this.client.execute(`SELECT * FROM bestselling`).catch(console.error);
        return bestsellings;
    }

    async getBestsellingById(id) {
        const [bestselling] = await this.client.execute(
            'SELECT * FROM bestselling WHERE id = ?',
            [id]
        ).catch(console.error);
        return bestselling[0];
    }

}