
module.exports = {
	transpileDependencies: ['vuetify'],
	"devServer": {
		"proxy": {
			"/api": {
				"target": "https://www.fatmouse.co.kr/"
			},
			
		},
		"clientLogLevel": "warning",
		"hot": true,
		"contentBase": "dist",
		"compress": true,
		"open": true,
		"overlay": {
			"warnings": false,
			"errors": true
		},
		"publicPath": "/",
		"quiet": true,
		"watchOptions": {
			"poll": false,
			"ignored": {}
		}
	},
	"productionSourceMap": false,
	
}
