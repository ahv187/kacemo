const { authorizeApiCall } = require('./auth');
const { pushIssue, getIssues } = require('./storage/github-store');
const { handleCorsPreflight } = require('./util');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;
// const { AUTHORIZED_EMAILS } = require('./auth'); 

module.exports = async (req, res) => {
  if(handleCorsPreflight(req, res)) { return; }
  
  try {
    if (req.method === 'GET') {
      let issues = await getIssues();
      res.status(200).json(issues.unpack());
    } else if (req.method === 'POST') {
      if(!authorizeApiCall(req, res)) { return; }
      // const authHeader = req.headers.authorization;
      // if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //   return res.status(401).json({ message: 'Autenticación requerida: Token Bearer faltante.' });
      // }
      // const token = authHeader.split(' ')[1];
    
      // let decoded;
      // try {
      //   decoded = jwt.verify(token, JWT_SECRET);
      // } catch (err) {
      //   return res.status(401).json({ message: 'Token inválido o expirado.' });
      // }
    
      // if (!AUTHORIZED_EMAILS.includes(decoded.email)) {
      //   return res.status(403).json({ message: `Acceso Denegado: Tu correo electrónico (${decoded.email}) no está autorizado para crear eventos.` });
      // }
      
      const { title, body } = req.body;
      let response = await pushIssue(title, body);
      res.status(201).json(response.unpack());
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(error.response ? error.response.status : 500).json({ message: 'An error occurred' });
  }
};