import {Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Base64} from 'https://deno.land/x/bb64@1.1.0/mod.ts';
import {Session} from 'https://deno.land/x/session@1.1.0/mod.ts';
import {ProductDto} from '../dto/product.dto.ts';
import {ValidationDto} from '../dto/validation.dto.ts';

const angularBuildPath = '../frontend/dist/M133-Dorfladen';

const app = new Application();
const router = new Router();

// Configure and start session
const session = new Session({framework: 'oak'});
await session.init();
app.use(session.use()(session));

let products: ProductDto[];

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

    .get('/webshop/api/cart/cost', async (context) => {
        const shoppingCart = await getShoppingCart(context);

        let price = 0;
        shoppingCart.forEach((amount: number, id: string) => {
            const product = getProductById(id);
            price += product.specialOffer ? product.specialOffer * amount : product.normalPrice * amount;
        });
        // Weird maths here in order to round to 2 decimals
        context.response.body = Math.round(price * 100) / 100;
    })

    .get('/webshop/api/cart', async (context) => {
        const shoppingCart = await getShoppingCart(context);

        let returnShoppingCart: [ProductDto, number][] = [];

        shoppingCart.forEach((amount: number, id: string) => {
            returnShoppingCart.push([getProductById(id), amount]);
        });

        context.response.body = returnShoppingCart;
    })

    .post('/webshop/api/cart/:id', async (context) => {
        const shoppingCart = await getShoppingCart(context);
        const product = getProductById(context.params.id!);

        const amountOfProductInCart = shoppingCart.get(product.id);
        if (amountOfProductInCart) {
            // Add one if it already is in cart
            shoppingCart.set(product.id, amountOfProductInCart + 1);
        } else {
            // Set amount to 1 if it doesn't already exist
            shoppingCart.set(product.id, 1);
        }
        context.response.status = 200;
    })

    .delete('/webshop/api/cart/:id', async (context) => {
        const shoppingCart = await getShoppingCart(context);
        const product = getProductById(context.params.id!);

        const amountOfProductToDelete = shoppingCart.get(product.id);

        if (amountOfProductToDelete == undefined) {
            context.response.status = 400;
        } else if (amountOfProductToDelete <= 1) {
            shoppingCart.delete(product.id);
            context.response.status = 200;
        } else {
            shoppingCart.set(product.id, amountOfProductToDelete - 1);
            context.response.status = 200;
        }
    })
    .put('/webshop/api/checkout', async (context) => {
        const shoppingCart = await getShoppingCart(context);
        const httpBody = await context.request.body();
        const userData: { firstname: string, lastname: string, email: string } = await httpBody.value;

        let validationDto = new ValidationDto(userData.firstname, userData.lastname, userData.email);

        if (validationDto.isValid()) {
            // Implement order process here

            shoppingCart.clear();
            context.response.status = 202;
        } else {
            context.response.status = 304;
        }
        context.response.body = JSON.stringify(validationDto);
    });

app.use(router.routes());
app.listen({port: 8000});

// Helper functions

async function getItemsFromJson() {
    products = JSON.parse(await Deno.readTextFile('./products.json'));

    products.forEach((product: ProductDto) => {
        product.imageName = 'data:image/png;base64,' + Base64.fromFile('images/' + product.imageName).toString();
    });
}

function getProductById(id: string): ProductDto {
    return products.find((product) => product.id === id)!;
}

async function getShoppingCart(context: any): Promise<Map<string, number>> {
    // Function sets up a new Session if necessary and returns the session id
    let cart = await context.state.session.get('cart');
    if (!cart) {
        // ProductId, amount in basket
        cart = new Map<string, number>();
        await context.state.session.set('cart', cart);
    }
    return cart;
}
