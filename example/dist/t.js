const root = process.cwd();
const path = require('path');
const fs = require('fs');
const basedir = './src/component';

function _upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function camelCase(str) {
    const camelizeRE = /-(\w)/g;
    return str.replace(camelizeRE, function (_, c) {
        return c ? c.toUpperCase() : '';
    });
}

function pascalCase(str) {
    return _upperFirst(camelCase(str));
}

function findFolders(dir) {
    return fs
        .readdirSync(dir, {
            withFileTypes: true,
        })
        .filter(function (dirent) {
            return dirent.isDirectory();
        })
        .map(function (dirent) {
            return path.resolve(dir, dirent.name);
        });
}

const components = findFolders(path.resolve(root, basedir)).map(function (p) {
    return path.basename(p);
});

const ejs = require('ejs');

const template = `
/**
 * @file index.ts
 * @desc 组件库导出文件
 * @author liangluwen
 */

import {Vue as _Vue} from 'vue/types/vue';
<%- imoprtStatement %>

const components = [<%= componentsStatementValue %>];

const install = function (Vue: typeof _Vue): void {
   components.forEach(function (component) {
       Vue.component(component.name, component);
   });
};

export default {
   install,
};

export {
   <%= exportStatementValue %>
};
`;

const imoprtStatement = components
    .map(function (componentName) {
        // 如果调整了目录 去掉了 tb- 就用第二行
        const moduleName = pascalCase(componentName);
        // const moduleName = pascalCase('tb-' + componentName);
        const exportName = `./component/${componentName}`;

        return `import ${moduleName} from '${exportName}';`;
    })
    .join('\n');

const componentsStatementValue = components
    .map(function (componentName) {
        const moduleName = pascalCase(componentName);

        return moduleName;
    })
    .join(', ');

const exportStatementValue = components
    .map(function (componentName) {
        const moduleName = pascalCase(componentName);

        return moduleName;
    })
    .join(',\n');

const content = ejs.render(template, {
    imoprtStatement,
    componentsStatementValue,
    exportStatementValue,
});

// TODO 加入 prettier 进行 content 的格式化
fs.writeFileSync(path.resolve(__dirname, './index.ts'), content, 'utf-8');