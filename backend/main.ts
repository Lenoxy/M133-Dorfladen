import {Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Base64} from 'https://deno.land/x/bb64@1.1.0/mod.ts';
import {Session} from 'https://deno.land/x/session@1.1.0/mod.ts';
import {v4} from 'https://deno.land/std@0.82.0/uuid/mod.ts';
import {ProductDto} from '../dto/product.dto.ts';
import {ShoppingCart} from './types/shopping-cart.type.ts';

const angularBuildPath = '../frontend/dist/M133-Dorfladen';

const app = new Application();
const router = new Router();

// Confugire and start session
const session = new Session({framework: 'oak'});
await session.init();
app.use(session.use()(session));

let products: ProductDto[];

const shoppingCarts: ShoppingCart[] = [];

console.log('Fetching data from products.json');
await getItemsFromJson();

async function serveStatic(context: any) {
    await context.send({
        root: Deno.cwd() + '/' + angularBuildPath,
        index: 'index.html',
        path: context.request.url.pathname.includes('.js')
            ? context.request.url.pathname
            : 'index.html'
    });
}

router
    // 0 to 2 segment routes handled by angular
    .get('/', (context) => serveStatic(context))
    .get('/:pathname', (context) => serveStatic(context))
    .get('/:pathname/:pathname', (context) => serveStatic(context))

    // more than 3 segment routes handled by backend
    .get('/webshop/api/items', (context) => {
        context.response.body = products;
    })

    .get('/webshop/api/item/:id', async (context) => {
        context.response.body = products.find((product) =>
            product.id === context.params.id
        );
    })

    .get('/webshop/api/cart', async (context) => {
        const sid = await manageSession(context);
        const shoppingCart = getCartBySid(sid);

        let price = 0;
        shoppingCart.products.forEach((amount: number, id: string) => {
            const product = getProductById(id);
            price += product.specialOffer ? product.specialOffer * amount : product.normalPrice * amount;
        });
        // Weird maths here in order to round to 2 decimals
        context.response.body = Math.round(price * 100) / 100;
    })

    .post('/webshop/api/cart/:id', async (context) => {
        const sid = await manageSession(context);
        const product = getProductById(context.params.id!);
        const cart = getCartBySid(sid);

        const amountOfProductInCart = cart.products.get(product.id);
        if (amountOfProductInCart) {
            // Add one if it already is in cart
            cart.products.set(product.id, amountOfProductInCart + 1);
        } else {
            // Set amount to 1 if it doesn't already exist
            cart.products.set(product.id, 1);
        }
        context.response.status = 200;
    })

    .delete('/webshop/api/cart/:id', async (context) => {
        await manageSession(context);

        console.log(context.params.id);
        context.response.body = null;
    });

app.use(router.routes());
app.listen({port: 8000});

// Helper functions

async function getItemsFromJson() {
    products = JSON.parse(await Deno.readTextFile('./products.json'));

    products.forEach((product: ProductDto) => {
        product.imageName = Base64.fromFile('images/' + product.imageName).toString();
    });
}

function getCartBySid(sid: string): ShoppingCart {
    return shoppingCarts.find((cart) => cart.sid === sid)!;
}

function getProductById(id: string): ProductDto {
    return products.find((product) => product.id === id)!;
}

async function manageSession(context: any): Promise<string> {
    // Function sets up a new Session if necessary and returns the session id
    const sid = await context.state.session.get('sid');
    if (!sid) {
        const newSessionId = v4.generate();
        console.log('Generating new sid', newSessionId);
        await context.state.session.set('sid', newSessionId);

        // Setup cart for new customer
        shoppingCarts.push({
            sid: newSessionId,
            products: new Map<string, number>()
        });
    }
    return sid;
}
