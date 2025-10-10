const { ActionRequest } = require('adminjs');

exports.isPOSTMethod = ({ method }) => method.toLowerCase() === 'post';

exports.isGETMethod = ({ method }) => method.toLowerCase() === 'get';

exports.isNewAction = ({ params: { action } }) => action === 'new';

exports.isEditAction = ({ params: { action } }) => action === 'edit';