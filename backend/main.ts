import {Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Base64} from 'https://deno.land/x/bb64@1.1.0/mod.ts';
import {Session} from 'https://deno.land/x/session@1.1.0/mod.ts';
import {v4} from 'https://deno.land/std@0.82.0/uuid/mod.ts';
import {ProductDto} from '../shared-types/product.dto.ts';

const angularBuildPath = '../frontend/dist/M133-Dorfladen';

const app = new Application();
const router = new Router();

// Confugire and start session
const session = new Session({framework: 'oak'});
await session.init();
app.use(session.use()(session));

let products: ProductDto[];

const carts = new Map<string, ProductDto[]>();

console.log('Fetching data from products.json');
await getItemsFromJson();

async function serveStatic(context: any) {
    console.log(context.request.url.pathname);
    await context.send({
        root: Deno.cwd() + '/' + angularBuildPath,
        index: 'index.html',
        path: context.request.url.pathname.includes('.js')
            ? context.request.url.pathname
            : 'index.html'
    });
}

router
    // 0 to 2 segment routes for angular
    .get('/', (context) => serveStatic(context))
    .get('/:pathname', (context) => serveStatic(context))
    .get('/:pathname/:pathname', (context) => serveStatic(context))

    // more than 3 segment routes handled by backend
    .get('/webshop/api/items', (context) => {
        context.response.body = products;
    })
    .get('/webshop/api/item/:id', async (context) => {
        console.log(context.params.id);
        context.response.body = products.find((product) =>
            product.id === context.params.id
        );
    })
    .get('/webshop/api/cart', async (context) => {
        await manageSession(context);
        const sid = await context.state.session.get('sid');
        const productArray = carts.get(sid);
        console.log(sid);

        let price = 0;
        console.log(productArray);
        if (productArray !== undefined) {
            for (let product of productArray) {
                price += product.specialOffer ? product.specialOffer : product.normalPrice;
            }
            context.response.body = price;
        } else {
            context.response.status = 400;
        }
    })
    .post('/webshop/api/cart/:id', async (context) => {
        await manageSession(context);
        const sid = await context.state.session.get('sid');
        const product = products.find((product) => product.id === context.params.id);
        const cart = carts.get(sid)

        if (product && cart) {
            cart.push(product);
            context.response.status = 200;

        } else {
            context.response.status = 400;
        }

        console.log(carts);
    })
    .delete('/webshop/api/cart/:id', async (context) => {
        await manageSession(context);

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


async function manageSession(context: any) {
    if (!await context.state.session.get('sid')) {
        const uuid = v4.generate();
        console.log('generating new uuid', uuid);
        await context.state.session.set('sid', uuid);

        // Setup cart for new customer
        carts.set(uuid, []);
    }
}
