const { isAuthenticated, notAuthenticated } = require(`../modules/authentication`);
const { connectToDB } = require(`../modules/database`);
const bcrypt = require('bcrypt'); 
const app = require(`../app`)

app.get(`/register`, notAuthenticated, async (req, res) => {
    res.render(`register`)
});

app.post(`/register`, notAuthenticated, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const adb = await connectToDB();
        
        const usernameExists = await adb.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
        console.log(usernameExists[0])
        if (usernameExists[0].length > 0) {
            adb.end();
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        const emailExists = await adb.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

        if (emailExists[0].length > 0) {
            adb.end();
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        await adb.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        adb.end();

        res.status(200).json({ msg: `User registered successfully` });
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
});