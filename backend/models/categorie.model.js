export class CategorieModel{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS categorie(
            id INT PRIMARY KEY AUTO_INCREMENT,
            categorie_name VARCHAR(255)
        )`).catch(console.error);
    }

    async getAllCategorie(){
        const [categorie] = await this.client.execute(`SELECT * FROM categorie`).catch(console.error);
        return categorie;
    }

    async addCategorie(categorie_name){
        const [insertCategorie] = await this.client.execute(`INSERT INTO categorie (categorie_name) VALUES (?)`,[categorie_name]).catch(console.error);
        return insertCategorie;
    }
}