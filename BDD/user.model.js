export class User{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS user(
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) UNIQUE,
            email VARCHAR(255),
            password VARCHAR(255)
        )`).catch(console.error);
    }

    async addUser(username, email, password) {
        try {
            // Vérifier si le username existe déjà
            const [existingUsers] = await this.client.execute(
                'SELECT id FROM user WHERE username = ?',
                [username]
            );

            if (existingUsers.length > 0) {
                throw new Error('Ce nom d\'utilisateur est déjà pris');
            }

            const [insertUser] = await this.client.execute(
                'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );
            return insertUser;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ce nom d\'utilisateur est déjà pris');
            }
            throw error;
        }
    }

    async getAllUser(){
        const [users] = await this.client.execute(`SELECT * FROM user`).catch(console.error);
        return users;
    }

    async suppUser(id){
        const [users] = await this.client.execute(`DELETE FROM user WHERE id =?`, [id]).catch(console.error);
        return users;
    }

    async suppAllUsers(){
        const [users] = await this.client.execute(`DROP TABLE IF EXISTS user`).catch(console.error);
        return users;
    }

    async login(email, password) {
        try {
            const [users] = await this.client.execute(
                'SELECT id, username, email FROM user WHERE email = ? AND password = ?',
                [email, password]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const [users] = await this.client.execute(
                'SELECT id, username, email FROM user WHERE id = ?',
                [id]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, username, email) {
        try {
            // Vérifier si le username existe déjà pour un autre utilisateur
            const [existingUsers] = await this.client.execute(
                'SELECT id FROM user WHERE username = ? AND id != ?',
                [username, id]
            );

            if (existingUsers.length > 0) {
                throw new Error('Ce nom d\'utilisateur est déjà pris');
            }

            const [result] = await this.client.execute(
                'UPDATE user SET username = ?, email = ? WHERE id = ?',
                [username, email, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            return this.getUserById(id);
        } catch (error) {
            throw error;
        }
    }
}