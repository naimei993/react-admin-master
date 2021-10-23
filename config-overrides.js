//配置具体修改规则
 const { override, fixBabelImports, addLessLoader,addDecoratorsLegacy } = require('customize-cra');


 module.exports = override(
     fixBabelImports('import', {
       libraryName: 'antd',
       libraryDirectory: 'es',
       style: 'css',
     }),
     addLessLoader({
       javascriptEnabled:true,
       modifyVars:{'@primary-color':'#1DA57A'}
     }),
     addDecoratorsLegacy({})
   );

 
