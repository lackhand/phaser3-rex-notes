import GetValue from '../../utils/object/GetValue.js';
import Save from './Save.js';
import Load from './Load.js';
import LoadHeaders from './LoadHeaders.js';
import Delete from './Delete.js';
import Clear from './Clear.js';
import ClearDict from '../../utils/object/Clear.js';

class Files {
    constructor(config) {
        this.database = firebase.firestore();
        this.setRootPath(GetValue(config, 'root', ''));

        this.cacheHeaders = {};

        // Owner
        this.userInfo = { userID: '' };
        this.setOwner(GetValue(config, 'userID', ''));

    }

    shutdown() {
    }

    destroy() {
        this.shutdown();
    }

    setRootPath(rootPath) {
        this.rootPath = rootPath;
        this.rootRef = this.database.collection(rootPath);
        return this;
    }

    setOwner(userID) {
        var prevUserID = this.userInfo.userID;
        if (typeof (userID) === 'string') {
            this.userInfo.userID = userID;
        } else {
            this.userInfo = userID;
        }
        if (prevUserID !== this.userInfo.userID) {
            this.clearCache();
        }
        return this;
    }

    clearCache() {
        ClearDict(this.cacheHeaders);
        return this;
    }

    getFileQuery(userID, fileID, type) {
        var query = this.rootRef;
        query = (userID) ? query.where('userID', '==', userID) : query;
        query = (fileID) ? query.where('fileID', '==', fileID) : query;
        query = (type) ? query.where('type', '==', type) : query;
        return query;
    }

}

var methods = {
    save: Save,
    load: Load,
    loadHeaders: LoadHeaders,
    delete: Delete,
    clear: Clear,
}

Object.assign(
    Files.prototype,
    methods
);

export default Files;