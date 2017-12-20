module.exports = () => {
    return async function(ctx, next) {
        console.log('middleware:query', ctx.request.body);
        await next();
    }
};