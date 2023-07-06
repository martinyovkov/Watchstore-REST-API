const authService = require('../services/authService');

exports.assureAdminIsCreated = async () => {
    const email = 'admin@watchstore.com';
    const password = '12345678';
    const username = 'admin'
    try {
        const existing = await authService.getUserByEmail(email);

        if (!existing) { 
            const user = await authService.create({ email, username, password }); 
        }
    } catch (error) {
        console.log(error);
    }
    
}