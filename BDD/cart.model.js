export class Cart{
    constructor(clientSQL){
        this.client = clientSQL;
        this.client.execute(`
            CREATE TABLE IF NOT EXISTS cart(
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            product_id INT,
            quantity INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).catch(console.error);
    }
    
    async getCart(userId = null){
        let query = `SELECT c.*, p.product_name, p.product_price, p.product_desc 
                     FROM cart c 
                     JOIN bestselling p ON c.product_id = p.id`;
        
        if (userId) {
            query += ` WHERE c.user_id = ?`;
            const [carts] = await this.client.execute(query, [userId]).catch(console.error);
            return carts;
        } else {
            const [carts] = await this.client.execute(query).catch(console.error);
            return carts;
        }
    }

    async addToCart(userId, productId, quantity = 1){
        try {
            // Vérifier si le produit est déjà dans le panier
            const [existing] = await this.client.execute(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existing.length > 0) {
                // Mettre à jour la quantité
                const newQuantity = existing[0].quantity + quantity;
                await this.client.execute(
                    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                    [newQuantity, userId, productId]
                );
                return { message: 'Quantité mise à jour dans le panier' };
            } else {
                // Ajouter le produit
                await this.client.execute(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity]
                );
                return { message: 'Produit ajouté au panier' };
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            throw error;
        }
    }

    async removeFromCart(userId, productId){
        try {
            await this.client.execute(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            return { message: 'Produit supprimé du panier' };
        } catch (error) {
            console.error('Erreur lors de la suppression du panier:', error);
            throw error;
        }
    }

    async updateQuantity(userId, productId, quantity){
        try {
            if (quantity <= 0) {
                return this.removeFromCart(userId, productId);
            }
            
            await this.client.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
            return { message: 'Quantité mise à jour' };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité:', error);
            throw error;
        }
    }

    async clearCart(userId){
        try {
            await this.client.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
            return { message: 'Panier vidé' };
        } catch (error) {
            console.error('Erreur lors du vidage du panier:', error);
            throw error;
        }
    }
}