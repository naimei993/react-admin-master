const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        '/api2',
        createProxyMiddleware(
            {
                target: "http://localhost:5000/",
               changeOrigin: true,
                pathRewrite: {
                '/api2': '',
            }
            }
        )
    );
    app.use(
        '/api1',
        createProxyMiddleware( 
            {
                target: "http://localhost:3000/",
                changeOrigin: true,
                pathRewrite: {
                '/api1': '',
            }
            }
        )
    );
    
};
