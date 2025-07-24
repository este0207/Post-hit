import bcrypt from 'bcrypt'
export class UserModel{
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

    async login(email, formpassword) {
        try {
            // Récupérer l'utilisateur avec son mot de passe hashé
            const [users] = await this.client.execute(
                'SELECT id, username, email, password FROM user WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return null;
            }

            const user = users[0];
            // Comparer le mot de passe fourni avec le hash stocké
            const isPasswordValid = await bcrypt.compare(formpassword, user.password);

            if (!isPasswordValid) {
                return null;
            }

            // Ne pas renvoyer le mot de passe dans la réponse
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
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

    async getUserByEmail(email) {
        try {
            const [users] = await this.client.execute(
                'SELECT id, username, email FROM user WHERE email = ?',
                [email]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, username, email, password) {
        try {
            // Vérifier si le username existe déjà pour un autre utilisateur
            const [existingUsers] = await this.client.execute(
                'SELECT id FROM user WHERE username = ? AND id != ?',
                [username, id]
            );

            if (existingUsers.length > 0) {
                throw new Error('Ce nom d\'utilisateur est déjà pris');
            }

            let query, params;
            if (password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                query = 'UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?';
                params = [username, email, hashedPassword, id];
            } else {
                query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
                params = [username, email, id];
            }

            const [result] = await this.client.execute(query, params);

            if (result.affectedRows === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            return this.getUserById(id);
        } catch (error) {
            throw error;
        }
    }
    async test(){ // test
        let [test] = await this.client.execute(`
            SELECT Orders.id, Customers.name, Orders.email
            FROM Orders
            INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

        `)
        console.log(test)
    }
}