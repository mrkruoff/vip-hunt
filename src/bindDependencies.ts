import container from "./inversify.config";


//This function is from https://github.com/inversify/InversifyJS/blob/master/wiki/recipes.md
// and is used for binding dependencies into functions
function bindDependencies(func, dependencies) {
    let injections = dependencies.map((dependency) => {
        return container.get(dependency); 
    
    });
    return func.bind(func, ...injections);
}

export default bindDependencies;
