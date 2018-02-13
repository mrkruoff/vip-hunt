import container from "./inversify.config";


//This function is from https://github.com/inversify/InversifyJS/blob/master/wiki/recipes.md
// and is used for binding dependencies into functions
var bindDependencies = function (func, dependencies) {
    let injections = dependencies.map((dependency) => {
        return container.get(dependency); 
    
    });
    return func.bind(func, ...injections);
}

export { bindDependencies };
