const { authorizeApiCall } = require('./auth');
const { pushIssue, getIssues } = require('./storage/github-store');
const { handleCorsPreflight } = require('./util');

module.exports = async (req, res) => {
  if(handleCorsPreflight(req, res)) { return; }

  try {
    if (req.method === 'GET') {
      let issues = await getIssues();
      res.status(200).json(issues.unpack().data);
    } else if (req.method === 'POST') {
      // if(!authorizeApiCall(req, res)) { return; }

      const { title, body } = req.body;
      let response = await pushIssue(title, body);
      res.status(201).json(response.unpack().data);
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(error.response ? error.response.status : 500).json({ message: 'An error occurred' });
  }
};