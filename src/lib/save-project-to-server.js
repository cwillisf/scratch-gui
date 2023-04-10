import queryString from 'query-string';
import storage from '../lib/storage';

const scratchFetch = storage.scratchFetch.scratchFetch;

/**
 * Save a project JSON to the project server.
 * This should eventually live in scratch-www.
 * @param {number} projectId the ID of the project, null if a new project.
 * @param {object} vmState the JSON project representation.
 * @param {object} params the request params.
 * @property {?number} params.originalId the original project ID if a copy/remix.
 * @property {?boolean} params.isCopy a flag indicating if this save is creating a copy.
 * @property {?boolean} params.isRemix a flag indicating if this save is creating a remix.
 * @property {?string} params.title the title of the project.
 * @return {Promise} A promise that resolves when the network request resolves.
 */
export default function (projectId, vmState, params) {
    const creatingProject = projectId === null || typeof projectId === 'undefined';
    const opts = {
        method: creatingProject ? 'POST' : 'PUT',
        body: vmState,
        // If we set json:true then the body is double-stringified, so don't
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };
    const queryParams = {};
    if (params.hasOwnProperty('originalId')) queryParams.original_id = params.originalId;
    if (params.hasOwnProperty('isCopy')) queryParams.is_copy = params.isCopy;
    if (params.hasOwnProperty('isRemix')) queryParams.is_remix = params.isRemix;
    if (params.hasOwnProperty('title')) queryParams.title = params.title;
    let qs = queryString.stringify(queryParams);
    if (qs) qs = `?${qs}`;
    const url = creatingProject ? `${storage.projectHost}/${qs}` : `${storage.projectHost}/${projectId}${qs}`;
    return scratchFetch(url, opts).then(response => {
        if (response.statusCode !== 200) throw response.statusCode;
        // Since we didn't set json: true, we have to parse manually (might throw)
        const body = JSON.parse(response.body);
        body.id = projectId;
        if (creatingProject) {
            body.id = body['content-name'];
        }
        return body;
    });
}
