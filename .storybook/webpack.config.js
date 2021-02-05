const path = require('path')
const rootPath = path.resolve(__dirname, '../project_eshop/src/')

module.exports = ({ config }) => {
	config.resolve.alias['@'] = rootPath

	return config
}
