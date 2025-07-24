export class ProductSize{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS productsize(
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_id INT,
            product_height DOUBLE,
            product_width DOUBLE
            )`).catch(console.error);
    }

    async getAllSizes(){
        try {
            const [rows] = await this.client.execute(`SELECT * FROM productsize`);
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des tailles:', error);
            return [];
        }
    }
}