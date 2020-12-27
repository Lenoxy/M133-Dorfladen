import {Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {ProductDto} from '../shared-types/product.dto.ts';
import {Base64} from 'https://deno.land/x/bb64/mod.ts';

const angularBuildPath = '../frontend/dist/M133-Dorfladen';

const app = new Application();
const router = new Router();


// Session konfigurieren und starten
//const session = new Session({framework: 'oak'});
//await session.init();
//app.use(session.use()(session));

let products: ProductDto[];

console.log('Fetching data from products.json');
await getItemsFromJson();

app.use(async (context) => {
    console.log(context.request.url.pathname)
    if(context.request.url.pathname.includes('api')){
        console.log('api call')
        return;
    }
    await context.send({
        root: Deno.cwd() +'/' +  angularBuildPath,
        index: "index.html",
        path: context.request.url.pathname.includes(".")
            ? context.request.url.pathname
            : "index.html"
    });
});

router
    .get('/api/items', (context) => {
        context.response.body = products;
    })
    .get('/api/item/:id', async (context) => {
        console.log(context.params.id);
        context.response.body = products.find((product) =>
            product.id === context.params.id
        );
    })
    .post('/api/cart/:id', async (context) => {
        console.log(context.params.id);
        context.response.body = null;
    })
    .delete('/api/cart/:id', async (context) => {
        console.log(context.params.id);
        context.response.body = null;
    });

app.use(router.routes());
app.listen({port: 8000});


async function getItemsFromJson() {
    products = JSON.parse(await Deno.readTextFile('./products.json'));
    products.forEach((product: ProductDto) => {
        product.imageName = Base64.fromFile('images/' + product.imageName).toString();
    });
}
