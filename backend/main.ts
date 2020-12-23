import {Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {v4} from 'https://deno.land/std/uuid/mod.ts';
import {Session} from 'https://deno.land/x/session@1.1.0/mod.ts';
import {ProductDto} from '../shared-types/product.dto.ts';
import {Base64} from 'https://deno.land/x/bb64/mod.ts';
import {oakCors} from 'https://deno.land/x/cors/mod.ts';

const angularBuildPath = '/../frontend/dist/M133-Dorfladen'

const app = new Application();
const router = new Router();


// Session konfigurieren und starten
const session = new Session({framework: 'oak'});
await session.init();
app.use(session.use()(session));

let products: ProductDto[];

console.log('Fetching data from products.json');
await getItemsFromJson();
console.log('Done');

router
    //.get('/', async (context) => {
    //    context.response.body = await Deno.readTextFile(angularBuildPath + '/index.html')
    //})
    //.get('/:filename', async (context) => {
    //    console.log(context.params.filename);
    //    context.response.headers.set("Content-Type", "application/json");
    //    context.response.body = await Deno.readTextFile(angularBuildPath + '/' + context.params.filename);
    //})
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
app.use(oakCors());
app.listen({port: 8000});

// Server static angular build
app.use(async (context) => {
    await context.send({
        root: Deno.cwd() + angularBuildPath,
        index: "index.html",
    });
});


async function getItemsFromJson() {
    products = JSON.parse(await Deno.readTextFile('./products.json'));
    products.forEach((product: ProductDto) => {
        product.imageName = Base64.fromFile('images/' + product.imageName).toString();
    });
}
