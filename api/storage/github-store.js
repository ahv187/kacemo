const axios = require('axios');

const GITHUB_USERNAME = 'ahv187';
const GITHUB_REPONAME = 'kacemo';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

const ok = (data=null) => { return { failed: false, data: data, unpack: () => { return data; } } };
const err = (error=null) => { return { failed: true, error: error, unpack: () => { throw error; } } };

const getObject = async (path) => {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/${path}`;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.object+json'
            }
        });
    
        return ok(response.data);
    } catch (error) {
        return err(error);
    }
};

const storeExists = async (path) => {
    return !getObject(path).failed;
};

const getJsonStore = async (path) => {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/${path}.json`;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.com.v3.raw'
            }
        });
        return ok(response.data);
    } catch (error) {
        return err(error);
    }
    
};

const setJsonStore = async (path, data, message="Update JSON store") =>  {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/${path}.json`;
    const store = getObject(`${path}.json`);
    const sha = store.failed ? 0 : store.data.sha;
    try {
        await axios.put(apiUrl, {
            message: `${message}: ${path}`,
            content: Buffer.from(data).toString('base64'),
            sha: sha
          }, {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json'
            }
          });
        return ok();
    } catch (error) {
        return err(error);
    }
};

const pushIssue = async (title, body) => {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/issues`;
    try {
        await axios.post(apiUrl, {
            title,
            body
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        return ok();
    } catch (error) {
        return err(error);
    }
};

const getIssues = async () => {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/issues`;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json'
            }
        });
        return ok(response.data);
    } catch(error) {
        return err(error);
    }
}

const setRawStore = async (path, base64, mimetype, message="Set raw store") => {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/${path}`;
    const store = getObject(`${path}.json`);
    const sha = store.failed ? 0 : store.data.sha;
    try {
        await axios.put(apiUrl, {
          message: `${message}: ${fileName} with type ${mimetype}`,
          content: base64,
          sha: sha
        }, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': mimetype, 
            Accept: 'application/vnd.github.v3+json',
          },
        });
        return ok();
    } catch (error) {
        return err(error);
    }
};

module.exports = {
    getObject, storeExists, setJsonStore, getJsonStore, pushIssue, getIssues, setRawStore 
};